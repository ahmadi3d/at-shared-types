import type {
    DataTransform,
    DataTransformDraft,
} from "../transform";

export type ApplyTransformScope =
    | "items"
    | "value";

/**
 * Applies a nested transform pipeline to either the current value or each
 * item. When `path` is present the nested pipeline is applied at that path.
 */
export interface ApplyTransformConfig {
    scope: ApplyTransformScope;
    path?: string;
    transform: DataTransform;
}

/**
 * Editable representation used while authoring an apply step. In particular,
 * the nested transform remains a DataTransformDraft so incomplete nested
 * steps can be represented without weakening the persisted final contract.
 */
export interface ApplyTransformConfigDraft extends Omit<Partial<ApplyTransformConfig>, "transform"> {
    transform?: DataTransformDraft;
}
