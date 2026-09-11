import type {
    ApplyTransformConfig,
    ApplyTransformConfigDraft,
    DistinctTransformConfig,
    FilterTransformConfig,
    JavascriptTransformConfig,
    LimitTransformConfig,
    MapTransformConfig,
    ParseJsonTransformConfig,
    SelectPathTransformConfig,
    SortTransformConfig,
} from "./steps";

/**
 * Maps every built-in transform step type to its serialized configuration.
 *
 * at-platform uses the matching type string as the key in its transform-step
 * runtime registry. Form Maker uses the same key in its separate editor
 * registry.
 */
export interface DataTransformStepConfigMap {
    selectPath: SelectPathTransformConfig;
    map: MapTransformConfig;
    filter: FilterTransformConfig;
    sort: SortTransformConfig;
    distinct: DistinctTransformConfig;
    limit: LimitTransformConfig;
    apply: ApplyTransformConfig;
    parseJson: ParseJsonTransformConfig;
    javascript: JavascriptTransformConfig;
}

export type DataTransformStepType = keyof DataTransformStepConfigMap;

/**
 * A fully configured, serializable transform step.
 *
 * `id` gives Form Maker and preview tracing a stable identity even when steps
 * are reordered.
 */
export type DataTransformStepValue = {
    [Type in DataTransformStepType]: {
        id: string;
        type: Type;
        config: DataTransformStepConfigMap[Type];
        enabled?: boolean;
    };
}[DataTransformStepType];

/**
 * Draft configuration for a built-in step. Apply is the only recursive step,
 * so it keeps a nested DataTransformDraft instead of requiring a fully
 * configured nested pipeline while authoring.
 */
export type DataTransformStepConfigDraft<Type extends DataTransformStepType> =
    Type extends "apply"
        ? ApplyTransformConfigDraft
        : Partial<DataTransformStepConfigMap[Type]>;

/**
 * Editable/incomplete representation used while a transform step is being
 * configured in Form Maker.
 */
export type DataTransformStepValueDraft = {
    [Type in DataTransformStepType]: {
        id: string;
        type: Type;
        config: DataTransformStepConfigDraft<Type>;
        enabled?: boolean;
    };
}[DataTransformStepType];
