import type { DataTransformExpression } from "../expression";

/**
 * Determines whether a map step reshapes every array item or the current
 * value itself.
 */
export type MapTransformScope =
    | "items"
    | "value";

export interface MapTransformFieldMapping {
    /**
     * Property path to write in the mapped result.
     * Nested paths such as `category.id` are allowed by the contract.
     */
    targetPath: string;

    /**
     * Expression evaluated against the current item/value.
     */
    expression: DataTransformExpression;
}

export interface MapTransformConfig {
    /**
     * `items` maps each element of an array.
     * `value` maps the current value once.
     */
    scope: MapTransformScope;

    mappings: MapTransformFieldMapping[];
}
