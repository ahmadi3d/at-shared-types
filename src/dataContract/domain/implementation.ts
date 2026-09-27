import type { AtJsonObject } from "../../core/domain/json.types";
import type {
    DataContractEnvironment,
    DataContractImplementationId,
    DataContractVersion,
} from "./identity";

/** Built-in implementation provider kinds. */
export type DataContractImplementationType =
    | "database"
    | "api"
    | "script";

/** Lifecycle of one concrete implementation binding. */
export type DataContractImplementationStatus =
    | "draft"
    | "active"
    | "disabled";

/**
 * Concrete HOW behind a Data Contract version.
 *
 * `config` is intentionally provider-owned JSON for now. Database/API/script
 * infrastructure is still evolving, so the shared Data Contract domain should
 * not freeze those implementation-specific schemas prematurely. Each provider
 * handler is responsible for validating and interpreting its own config.
 *
 * Input mapping, output mapping/transforms, procedure/API identifiers, and
 * script settings may live inside that provider config until their platform
 * contracts are stable enough to promote into dedicated shared interfaces.
 */
export interface DataContractImplementationDefinition<
    TConfig extends AtJsonObject = AtJsonObject,
> {
    contractVersion: DataContractVersion;
    environment?: DataContractEnvironment;
    type: DataContractImplementationType;
    status: DataContractImplementationStatus;
    config: TConfig;
}

/** Standalone persisted/read model when implementations receive dedicated IDs. */
export interface DataContractImplementationRecord<
    TConfig extends AtJsonObject = AtJsonObject,
> extends DataContractImplementationDefinition<TConfig> {
    id: DataContractImplementationId;
    dataContractId: import("./identity").DataContractId;
}
