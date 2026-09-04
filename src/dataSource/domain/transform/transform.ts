import type {
    DataTransformStepValue,
    DataTransformStepValueDraft,
} from "./step";

export type DataTransformVersion = 1;

/**
 * Ordered data transformation pipeline stored with a DataSource binding.
 */
export interface DataTransform {
    version: DataTransformVersion;
    steps: DataTransformStepValue[];
}

/**
 * Editable/incomplete representation used by Form Maker while authoring a
 * transformation pipeline.
 */
export interface DataTransformDraft {
    version: DataTransformVersion;
    steps: DataTransformStepValueDraft[];
}
