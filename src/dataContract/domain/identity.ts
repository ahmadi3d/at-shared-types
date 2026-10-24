/**
 * Stable application-level identity of a Data Contract.
 *
 * `string | number` intentionally supports the current legacy Entity-backed
 * persistence as well as a future dedicated Data Contract store/API. Callers
 * must treat this value as opaque and must not derive storage details from it.
 */
export type DataContractId = string | number;

/** Additive server-issued UUID; internal numeric IDs and stable keys remain valid. */
export type DataContractUuid = string;

/** Stable machine-readable key such as `customer.getBasicInfo`. */
export type DataContractKey = string;

/** Published/draft contract version number. */
export type DataContractVersion = number;

/** Dynamic references are resolved from the saved catalog on every use. */
export type DataContractVersionSelector =
    | { kind: "exact"; version: DataContractVersion }
    | { kind: "latestPublished" }
    | { kind: "latestDraft" };

/** Optional identity of a concrete implementation binding. */
export type DataContractImplementationId = string | number;

/** Logical deployment environment name, e.g. `development` or `production`. */
export type DataContractEnvironment = string;

/** Portable reference used by DataSource, workflow, and future consumers. */
export interface DataContractReference {
    dataContractId: DataContractId;
    /** Legacy numbers remain pinned; new consumers may use a named selector. */
    version: DataContractVersion | DataContractVersionSelector;
}
