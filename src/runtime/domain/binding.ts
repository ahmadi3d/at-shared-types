import type { DataTransform } from "../../dataSource/domain/transform";
import type { RuntimeValueExpression } from "./valueExpression";

export type RuntimeValueBindingVersion = 1;

/**
 * Generic persisted binding from a runtime expression to one consumer.
 *
 * Resolution order is expression -> canonical value -> optional consumer
 * transform -> consumer value. The transform therefore never operates on a
 * DataSourceExecutionResult.raw value.
 */
export interface RuntimeValueBinding {
    version: RuntimeValueBindingVersion;
    value: RuntimeValueExpression;
    transform?: DataTransform;
}
