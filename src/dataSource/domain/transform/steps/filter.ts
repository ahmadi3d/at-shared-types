import type { DataTransformExpression } from "../expression";

export type FilterTransformComparisonOperator =
    | "eq"
    | "neq"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "contains"
    | "startsWith"
    | "endsWith"
    | "in"
    | "notIn"
    | "isNull"
    | "isNotNull"
    | "isEmpty"
    | "isNotEmpty"
    | "truthy"
    | "falsy";

export interface FilterTransformRule {
    type: "rule";

    left: DataTransformExpression;

    operator: FilterTransformComparisonOperator;

    /**
     * Operators such as `isNull`, `isEmpty`, and `truthy` do not require a
     * right-hand expression.
     */
    right?: DataTransformExpression;
}

export type FilterTransformLogicalOperator =
    | "and"
    | "or";

export interface FilterTransformGroup {
    type: "group";

    operator: FilterTransformLogicalOperator;

    conditions: FilterTransformCondition[];

    /**
     * Negates the result of the group when enabled.
     */
    negate?: boolean;
}

export type FilterTransformCondition =
    | FilterTransformRule
    | FilterTransformGroup;

export interface FilterTransformConfig {
    condition: FilterTransformCondition;
}
