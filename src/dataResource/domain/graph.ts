import type { DataResourceId } from "./identity";
import type { DataResource } from "./resource";

/** Independent persisted version for the DataGraph contract. */
export type DataGraphVersion = 1;

/**
 * Normalized, non-visual collection of reusable resources.
 *
 * Execution order and runtime state are intentionally derived by consumers
 * and are not persisted in this contract.
 */
export interface DataGraph {
    version: DataGraphVersion;
    resources: Record<DataResourceId, DataResource>;
}
