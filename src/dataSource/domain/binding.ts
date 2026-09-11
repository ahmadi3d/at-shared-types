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
 * A DataSource together with declared runtime inputs and an optional source
 * transform. The transform converts the provider's resolved source value into
 * the binding's canonical value.
 *
 * When a binding belongs to a SourceDataResource this canonical value is the
 * resource value. For an inline single-consumer DataSource it remains the
 * resolved DataSource value consumed by that binding. Consumer-specific
 * adaptation belongs to RuntimeValueBinding rather than this type.
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
