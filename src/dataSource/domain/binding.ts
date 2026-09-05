import type {
    DataTransform,
    DataTransformDraft,
} from "./transform";
import type {
    DataSourceValue,
    DataSourceValueDraft,
} from "./value";
import type { RuntimeValueExpression, RuntimeValueExpressionDraft } from "../../runtime/domain";

export type DataSourceBindingVersion = 1;

/**
 * Maps source input target paths to values resolved from the current runtime.
 * Target paths may be nested, for example `filters.status`.
 */
export type DataSourceInputBindings = Record<string, RuntimeValueExpression>;
export type DataSourceInputBindingsDraft = Record<string, RuntimeValueExpressionDraft>;

/**
 * A DataSource together with the optional transformation pipeline that adapts
 * its resolved value before it is passed to the consumer.
 */
export interface DataSourceBinding {
    version: DataSourceBindingVersion;
    source: DataSourceValue;
    inputs?: DataSourceInputBindings;
    transform?: DataTransform;
}

/**
 * Editable/incomplete representation used by Form Maker while configuring a
 * DataSource binding.
 */
export interface DataSourceBindingDraft {
    version: DataSourceBindingVersion;
    source: DataSourceValueDraft;
    inputs?: DataSourceInputBindingsDraft;
    transform?: DataTransformDraft;
}
