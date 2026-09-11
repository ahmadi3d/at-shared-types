/** Stable JSON-safe identity for a configured data resource. */
export type DataResourceId = string;

/**
 * Controls when a source resource is executed.
 *
 * `manual` is intentionally not used here because it is already a DataSource
 * provider type with different semantics.
 */
export type DataResourceExecutionMode =
    | "reactive"
    | "onDemand";
