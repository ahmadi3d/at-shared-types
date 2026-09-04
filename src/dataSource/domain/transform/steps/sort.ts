import type { DataTransformExpression } from "../expression";

export type SortTransformDirection =
    | "asc"
    | "desc";

export type SortTransformNullPlacement =
    | "first"
    | "last";

export interface SortTransformField {
    expression: DataTransformExpression;
    direction: SortTransformDirection;
    nulls?: SortTransformNullPlacement;
}

export interface SortTransformConfig {
    fields: SortTransformField[];
}
