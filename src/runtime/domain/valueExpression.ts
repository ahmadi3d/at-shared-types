import type { DataResourceId } from "../../dataResource/domain/identity";
import type { AtJsonValue } from "../../core/domain/json.types";

export interface ConstantRuntimeValueExpression {
    type: "constant";
    value: AtJsonValue;
}

/**
 * Reads a value from the current form data. When `path` is omitted the entire
 * form data value is returned.
 */
export interface FormValueRuntimeValueExpression {
    type: "formValue";
    path?: string;
}

/**
 * Reads from the event payload that triggered the current action pipeline.
 */
export interface EventRuntimeValueExpression {
    type: "event";
    path?: string;
}

/**
 * Reads the result produced by a previously executed action.
 */
export interface ActionResultRuntimeValueExpression {
    type: "actionResult";
    actionId: string;
    path?: string;
}

/**
 * Reads a named runtime variable, optionally selecting a nested value.
 */
export interface VariableRuntimeValueExpression {
    type: "variable";
    name: string;
    path?: string;
}

/**
 * Reads from the host/runtime context, for example route or current-user data.
 */
export interface ContextRuntimeValueExpression {
    type: "context";
    path?: string;
}


/**
 * Reads the canonical value of a configured DataResource, optionally selecting
 * a nested path. This expression is a read reference only; it does not execute
 * or otherwise control the resource.
 */
export interface ResourceRuntimeValueExpression {
    type: "resource";
    resourceId: DataResourceId;
    path?: string;
}

/**
 * Escape hatch for values that cannot be expressed by the declarative modes.
 * The host runtime owns the available script context and execution policy.
 */
export interface JavascriptRuntimeValueExpression {
    type: "javascript";
    code: string;
}

export interface RuntimeValueExpressionMap {
    constant: ConstantRuntimeValueExpression;
    formValue: FormValueRuntimeValueExpression;
    event: EventRuntimeValueExpression;
    actionResult: ActionResultRuntimeValueExpression;
    variable: VariableRuntimeValueExpression;
    context: ContextRuntimeValueExpression;
    resource: ResourceRuntimeValueExpression;
    javascript: JavascriptRuntimeValueExpression;
}

export type RuntimeValueExpressionType = keyof RuntimeValueExpressionMap;
export type RuntimeValueExpression = RuntimeValueExpressionMap[RuntimeValueExpressionType];

/**
 * Editable/incomplete representation used by visual editors while a runtime
 * value expression is being configured.
 */
export type RuntimeValueExpressionDraft =
    | { type: null }
    | {
        [Type in RuntimeValueExpressionType]: { type: Type } & Partial<Omit<RuntimeValueExpressionMap[Type], "type">>;
    }[RuntimeValueExpressionType];
