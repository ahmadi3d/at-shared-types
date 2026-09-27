import type { AtJsonValue } from "../../core/domain/json.types";
import type { DataShape } from "../../dataShape/domain";
import type { DataContractImplementationDefinition } from "./implementation";
import type {
    DataContractKey,
    DataContractVersion,
    DataContractId,
} from "./identity";

/** Lifecycle of one immutable/publishable Data Contract version. */
export type DataContractStatus =
    | "draft"
    | "published"
    | "deprecated"
    | "retired";

/**
 * Declares whether invoking the contract is observational or may mutate state.
 *
 * Preview/mock tooling can use this to avoid accidentally executing writes.
 */
export type DataContractEffect = "read" | "write";

/**
 * Optional author-provided mock override.
 *
 * When omitted, the runtime may generate representative output directly from
 * `outputShape`. An explicit example gives designers a stable hand-authored
 * response while a real implementation does not yet exist.
 */
export interface DataContractMockDefinition {
    example?: AtJsonValue;
}

/**
 * Versioned promise made by a Data Contract.
 *
 * This describes WHAT callers may send and receive. It deliberately contains
 * no database/API/script implementation details.
 */
export interface DataContractVersionDefinition {
    version: DataContractVersion;
    status: DataContractStatus;
    effect: DataContractEffect;
    inputShape: DataShape;
    outputShape: DataShape;
    mock?: DataContractMockDefinition;
}

/** Stable, implementation-independent definition authored by the user. */
export interface DataContractDefinition {
    key: DataContractKey;
    name: string;
    description?: string;
    versions: DataContractVersionDefinition[];
}

/**
 * JSON document owned by the Data Contract module.
 *
 * The current legacy Entity adapter can persist this whole value in `dataJson`.
 * A future dedicated repository can reconstruct the exact same service model
 * from normalized tables without leaking that storage change to consumers.
 */
export interface DataContractDocument {
    definition: DataContractDefinition;
    implementations: DataContractImplementationDefinition[];
}

/**
 * Stored/read model returned by Data Contract services.
 *
 * `id` is kept outside the JSON document so callers never need to know whether
 * it came from today's Entity-row ID or a future dedicated Data Contract ID.
 */
export interface DataContractRecord extends DataContractDocument {
    id: DataContractId;
}
