import type { AtJsonValue } from "../../core/domain/json.types";
import type { RuntimeValueExpression } from "./valueExpression";

/** Conditions read declared values synchronously; they never execute scripts. */
export type DeclarativeRuntimeValueExpression = Exclude<
    RuntimeValueExpression,
    { type: "javascript" }
>;

/** Hosts may supply their existing safe selectors, such as Action step values. */
export type RuntimeCondition<TSource = DeclarativeRuntimeValueExpression> =
    | {
        kind: "compare";
        source: TSource;
        operator: "isEmpty" | "isNotEmpty";
        value?: never;
    }
    | {
        kind: "compare";
        source: TSource;
        operator: "equals" | "notEquals";
        value: AtJsonValue;
    }
    | {
        kind: "all" | "any";
        conditions: RuntimeCondition<TSource>[];
    }
    | {
        kind: "not";
        condition: RuntimeCondition<TSource>;
    };

/** Evaluation hosts deny invalid/unresolved selectors and enforce these limits. */
export interface RuntimeConditionPolicy {
    maxDepth: number;
    maxNodes: number;
    maxPathLength: number;
}
