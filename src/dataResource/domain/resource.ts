import type { DataSourceBinding } from "../../dataSource/domain/binding";
import type { DataTransform } from "../../dataSource/domain/transform";
import type { RuntimeValueExpression } from "../../runtime/domain/valueExpression";
import type {
    DataResourceExecutionMode,
    DataResourceId,
} from "./identity";

/**
 * Reusable resource backed by one existing DataSourceBinding.
 *
 * Provider configuration, declared source inputs, and source canonicalization
 * remain owned by DataSourceBinding rather than being duplicated here.
 */
export interface SourceDataResource {
    id: DataResourceId;
    name: string;
    kind: "source";
    execution: DataResourceExecutionMode;
    dataSource: DataSourceBinding;
}

/**
 * Reactive resource derived from explicitly declared runtime-value inputs.
 * The transform receives one object assembled from the named input values.
 */
export interface ComputedDataResource {
    id: DataResourceId;
    name: string;
    kind: "computed";
    execution: "reactive";
    inputs: Record<string, RuntimeValueExpression>;
    transform: DataTransform;
}

export type DataResource =
    | SourceDataResource
    | ComputedDataResource;
