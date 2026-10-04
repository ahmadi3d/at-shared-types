import type {
    WorkflowRouteCondition,
    WorkflowRouteOperator,
    WorkflowRouteValue,
} from "../domain/condition";

const blockedSegments = new Set(["__proto__", "prototype", "constructor"]);
const comparisonOperators = new Set(["==", "!=", ">", ">=", "<", "<="]);
const tokenPattern = /\s*(\&\&|\|\||==|!=|>=|<=|>|<|\(|\)|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?|"(?:[^"\\\r\n]|\\["\\])*"|'(?:[^'\\\r\n]|\\['\\])*'|[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*)/y;

/** Closed Flowable EL subset: context path compared with a literal, AND/OR and grouping. */
export function parseWorkflowRouteCondition(expression: string): WorkflowRouteCondition | null {
    const wrapped = /^\$\{([\s\S]*)\}$/.exec(expression.trim());
    if (!wrapped || expression.length > 4000)
        return null;
    const source = wrapped[1].trim();
    const tokens: string[] = [];
    let offset = 0;
    while (offset < source.length) {
        tokenPattern.lastIndex = offset;
        const match = tokenPattern.exec(source);
        if (!match || tokens.length >= 256)
            return null;
        tokens.push(match[1]);
        offset = tokenPattern.lastIndex;
    }
    let index = 0;
    let comparisons = 0;
    const parseAtom = (depth: number): WorkflowRouteCondition | null => {
        if (depth > 16)
            return null;
        if (tokens[index] === "(") {
            index++;
            const result = parseGroup("||", depth + 1);
            if (!result || tokens[index++] !== ")")
                return null;
            return result;
        }
        const path = tokens[index++];
        const segments = path?.split(".") ?? [];
        const operator = tokens[index++];
        const literal = tokens[index++];
        if (segments[0] !== "atContext" || segments.length < 2 || segments.length > 32 ||
            segments.some(segment => blockedSegments.has(segment)) ||
            !comparisonOperators.has(operator) || literal === undefined || ++comparisons > 32)
            return null;
        let value: WorkflowRouteValue;
        if (literal === "null")
            value = null;
        else if (literal === "true" || literal === "false")
            value = literal === "true";
        else if (/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/.test(literal)) {
            value = Number(literal);
            if (!Number.isFinite(value) || Math.abs(value) > Number.MAX_SAFE_INTEGER)
                return null;
        } else if (literal[0] === '"' || literal[0] === "'") {
            value = literal.slice(1, -1).replace(/\\(["'\\])/g, "$1");
            if (value.length > 512 || /[\x00-\x1f]/.test(value))
                return null;
        } else
            return null;
        if (!["==", "!="].includes(operator) && typeof value !== "number")
            return null;
        return {
            kind: "comparison",
            path,
            operator: operator as WorkflowRouteOperator,
            value,
        };
    };
    const parseGroup = (operator: "&&" | "||", depth: number): WorkflowRouteCondition | null => {
        const child = () => operator === "||" ? parseGroup("&&", depth) : parseAtom(depth);
        const first = child();
        if (!first)
            return null;
        const conditions = [first];
        while (tokens[index] === operator) {
            index++;
            const next = child();
            if (!next)
                return null;
            conditions.push(next);
        }
        return conditions.length === 1 ? first : { kind: "group", operator, conditions };
    };
    const result = parseGroup("||", 0);
    return index === tokens.length ? result : null;
}

/** Compile only a tree that round-trips through the same closed parser. */
export function compileWorkflowRouteCondition(condition: WorkflowRouteCondition): string | null {
    let comparisons = 0;
    let nodes = 0;
    const render = (node: WorkflowRouteCondition, depth: number): string | null => {
        if (depth > 16 || ++nodes > 256)
            return null;
        if (node.kind === "comparison") {
            if (++comparisons > 32)
                return null;
            return `${node.path} ${node.operator} ${JSON.stringify(node.value)}`;
        }
        if (node.conditions.length < 2 || node.conditions.length > 32)
            return null;
        const children = node.conditions.map(child => render(child, depth + 1));
        if (children.some(child => child === null))
            return null;
        return `(${children.join(` ${node.operator} `)})`;
    };
    const body = render(condition, 0);
    if (body === null)
        return null;
    const expression = `\${${body}}`;
    return parseWorkflowRouteCondition(expression) ? expression : null;
}
