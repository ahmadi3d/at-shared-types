import type { AtJsonValue } from "../../../core/domain/json.types";

/**
 * Reads a value from the current transform scope using a property path.
 *
 * The runtime is responsible for defining the supported path syntax. The
 * initial at-platform implementation uses normal dotted/bracket property
 * paths (for example: `product.id` or `items[0].name`).
 */
export interface DataTransformPathExpression {
    type: "path";
    path: string;
}

/**
 * Produces a literal JSON value.
 */
export interface DataTransformConstantExpression {
    type: "constant";
    value: AtJsonValue;
}

/**
 * Produces a string from a template evaluated against the current transform
 * scope.
 *
 * Template syntax is intentionally owned by the runtime so the serialized
 * contract can stay stable while the evaluator evolves.
 */
export interface DataTransformTemplateExpression {
    type: "template";
    template: string;
}

/**
 * Serializable expression types supported by the visual transform system.
 *
 * JavaScript remains available as a transform step for transformations that
 * cannot be represented by these declarative expressions.
 */
export type DataTransformExpression =
    | DataTransformPathExpression
    | DataTransformConstantExpression
    | DataTransformTemplateExpression;
