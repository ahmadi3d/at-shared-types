import type {
    DataTransform,
    DataTransformDraft,
} from "./transform";
import type {
    DataSourceValue,
    DataSourceValueDraft,
} from "./value";

export type DataSourceBindingVersion = 1;

/**
 * A DataSource together with the optional transformation pipeline that adapts
 * its resolved value before it is passed to the consumer.
 */
export interface DataSourceBinding {
    version: DataSourceBindingVersion;
    source: DataSourceValue;
    transform?: DataTransform;
}

/**
 * Editable/incomplete representation used by Form Maker while configuring a
 * DataSource binding.
 */
export interface DataSourceBindingDraft {
    version: DataSourceBindingVersion;
    source: DataSourceValueDraft;
    transform?: DataTransformDraft;
}
