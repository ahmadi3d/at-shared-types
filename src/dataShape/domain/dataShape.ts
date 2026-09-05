import type { AtJsonValue } from "../../core/domain/json.types";

export type DataShapeKind =
    | "unknown"
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array";

export interface DataShapeBase {
    nullable?: boolean;
    description?: string;
    example?: AtJsonValue;
}

/**
 * Represents a value whose structure is intentionally not constrained.
 */
export interface UnknownDataShape extends DataShapeBase {
    kind: "unknown";
}

export interface StringDataShape extends DataShapeBase {
    kind: "string";

    /**
     * Optional semantic format such as `date`, `date-time`, `email`, or a
     * project-defined value understood by the consumer.
     */
    format?: string;

    /**
     * Optional set of allowed string values when the shape is enum-like.
     */
    enum?: string[];
}

export interface NumberDataShape extends DataShapeBase {
    kind: "number";
}

export interface IntegerDataShape extends DataShapeBase {
    kind: "integer";
}

export interface BooleanDataShape extends DataShapeBase {
    kind: "boolean";
}

export interface DataShapeField {
    name: string;
    title?: string;
    description?: string;
    required?: boolean;
    shape: DataShape;
}

export interface ObjectDataShape extends DataShapeBase {
    kind: "object";
    fields: DataShapeField[];

    /**
     * Controls whether properties not declared in `fields` are allowed.
     * A DataShape value can be supplied to describe those extra properties.
     */
    additionalProperties?: boolean | DataShape;
}

export interface ArrayDataShape extends DataShapeBase {
    kind: "array";
    item: DataShape;
}

/**
 * Business-neutral structural description reused by Data Contracts, source
 * metadata, previews, and Form Maker output-shape assistance.
 *
 * This intentionally describes data structure rather than runtime validation
 * or UI behavior. Additional shape kinds can be added without changing the
 * consumers of the discriminated union.
 */
export type DataShape =
    | UnknownDataShape
    | StringDataShape
    | NumberDataShape
    | IntegerDataShape
    | BooleanDataShape
    | ObjectDataShape
    | ArrayDataShape;
