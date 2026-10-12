import type {
    AiCompiledContract,
    AiContractShapeNode,
    AiContractSpecification,
    AiContractEditorDraft,
} from "../domain/contract-authoring";
import type { AtJsonValue } from "../../core/domain/json.types";
import type { DataShape } from "../../dataShape/domain";
import { AiContractSpecificationSchema, AiContractEditorDraftSchema } from "../protocol/contract-authoring";
import { validateAiProtocol } from "../protocol/platform-validation";

export class AiContractCompilationError extends Error {
    constructor(
        public readonly code: string,
        public readonly path: string,
    ) {
        super(code);
        this.name = "AiContractCompilationError";
    }
}
const fail = (code: string, path: string): never => {
    throw new AiContractCompilationError(code, path);
};

/** Deterministic native WHAT compilation; no dependency resolution, execution or persistence. */
function compileAiContractShape(nodes: readonly AiContractShapeNode[]): DataShape {
    const byPath = new Map(nodes.map((node) => [node.path, node]));
    if (byPath.size !== nodes.length || !byPath.has("")) fail("AI_CONTRACT_SHAPE_PATH", "");
    for (const node of nodes) {
        if (
            node.path !== "" &&
            (!/^\/(?:[a-zA-Z][a-zA-Z0-9_]{0,99}|\*)(?:\/(?:[a-zA-Z][a-zA-Z0-9_]{0,99}|\*))*$/.test(node.path) ||
                node.path.split("/").length > 6)
        )
            fail("AI_CONTRACT_SHAPE_PATH", node.path);
        if (node.kind !== "string" && (node.format !== null || node.enum.length))
            fail("AI_CONTRACT_SHAPE_METADATA", node.path);
        if (node.kind !== "object" && node.additionalProperties) fail("AI_CONTRACT_SHAPE_METADATA", node.path);
        if ((node.path === "" || node.path.endsWith("/*")) && node.required)
            fail("AI_CONTRACT_SHAPE_METADATA", node.path);
    }
    const visited = new Set<string>();
    const build = (path: string): DataShape => {
        const node = byPath.get(path);
        if (!node) return fail("AI_CONTRACT_SHAPE_PATH", path);
        visited.add(path);
        const base = { nullable: node.nullable, ...(node.description ? { description: node.description } : {}) };
        const children = nodes.filter(
            (item) => item.path.startsWith(path + "/") && !item.path.slice(path.length + 1).includes("/"),
        );
        if (node.kind === "object") {
            if (
                children.some(
                    (item) => item.path.endsWith("/*") || /\/(?:constructor|prototype|__proto__)$/.test(item.path),
                )
            )
                return fail("AI_CONTRACT_SHAPE_PATH", path);
            return {
                ...base,
                kind: "object",
                additionalProperties: node.additionalProperties,
                fields: children.map((item) => ({
                    name: item.path.slice(path.length + 1),
                    required: item.required,
                    shape: build(item.path),
                })),
            };
        }
        if (node.kind === "array") {
            if (children.length !== 1 || children[0].path !== path + "/*") return fail("AI_CONTRACT_ARRAY_ITEM", path);
            return { ...base, kind: "array", item: build(path + "/*") };
        }
        if (children.length) return fail("AI_CONTRACT_PRIMITIVE_CHILDREN", path);
        if (node.kind === "string")
            return {
                ...base,
                kind: "string",
                ...(node.format ? { format: node.format } : {}),
                ...(node.enum.length ? { enum: [...node.enum] } : {}),
            };
        return { ...base, kind: node.kind };
    };
    const shape = build("");
    if (visited.size !== nodes.length) fail("AI_CONTRACT_ORPHAN_NODE", "");
    return shape;
}

/** Local WHAT changes only; native validation checks replacement sample semantics on the backend. */
export function compileAiContractEditorDraft(input: unknown) {
    const parsed = validateAiProtocol<AiContractEditorDraft>(AiContractEditorDraftSchema, input);
    if (parsed.status !== "valid") return fail("AI_CONTRACT_EDITOR_INVALID", "");
    const draft = parsed.value;
    if (draft.name !== null && !draft.name.trim()) return fail("AI_CONTRACT_EDITOR_INVALID", "name");
    if (
        draft.mockMode === "replace"
            ? draft.mockOutputJson === null || draft.outputNodes === null
            : draft.mockOutputJson !== null
    )
        return fail("AI_CONTRACT_EDITOR_MOCK_INVALID", "mockOutputJson");
    if (
        [draft.name, draft.description, draft.effect, draft.inputNodes, draft.outputNodes].every(
            (value) => value === null,
        ) &&
        draft.mockMode === "unchanged"
    )
        return fail("AI_CONTRACT_EDITOR_EMPTY", "");
    let example: AtJsonValue | undefined;
    if (draft.mockMode === "replace") {
        try {
            example = JSON.parse(draft.mockOutputJson!) as AtJsonValue;
        } catch {
            return fail("AI_CONTRACT_EXAMPLE_JSON", "mockOutputJson");
        }
    }
    return {
        draft,
        ...(draft.inputNodes !== null ? { inputShape: compileAiContractShape(draft.inputNodes) } : {}),
        ...(draft.outputNodes !== null ? { outputShape: compileAiContractShape(draft.outputNodes) } : {}),
        ...(draft.mockMode === "replace" ? { example } : {}),
    };
}

export function compileAiContractSpecification(input: unknown): AiCompiledContract {
    const parsed = validateAiProtocol<AiContractSpecification>(AiContractSpecificationSchema, input);
    if (parsed.status !== "valid") return fail("AI_CONTRACT_SPECIFICATION_INVALID", "");
    const value = parsed.value;
    if (!value.name.trim() || new TextEncoder().encode(JSON.stringify(value)).length > 48000)
        return fail("AI_CONTRACT_SPECIFICATION_INVALID", "");
    return {
        key: value.key,
        name: value.name,
        description: value.description,
        draft: {
            effect: value.effect,
            inputShape: compileAiContractShape(value.inputNodes),
            outputShape: compileAiContractShape(value.outputNodes),
        },
    };
}
