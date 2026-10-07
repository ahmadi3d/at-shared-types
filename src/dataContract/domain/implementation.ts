import type { AtJsonObject } from "../../core/domain/json.types";
import type { DataContractImplementationConfigMap } from "./providers";
import type {
    DataContractEnvironment,
    DataContractImplementationId,
    DataContractVersion,
} from "./identity";

/** Built-in implementation provider kinds. */
export type DataContractImplementationType = keyof DataContractImplementationConfigMap;

export type DataContractImplementationConfig =
    | AtJsonObject
    | DataContractImplementationConfigMap[DataContractImplementationType];

/** Lifecycle of one concrete implementation binding. */
export type DataContractImplementationStatus =
    | "draft"
    | "active"
    | "disabled";

/**
 * Concrete HOW behind a Data Contract version.
 *
 * Built-in schemas are declared in DataContractImplementationConfigMap.
 * Provider handlers validate config at the service boundary. Generic JSON is
 * retained for catalog adapters and drafts; runtime must use the validated
 * discriminated BuiltInDataContractImplementationDefinition.
 */
export interface DataContractImplementationDefinition<
    TConfig extends DataContractImplementationConfig = DataContractImplementationConfig,
> {
    contractVersion: DataContractVersion;
    environment?: DataContractEnvironment;
    type: DataContractImplementationType;
    status: DataContractImplementationStatus;
    config: TConfig;
}

/** Standalone persisted/read model when implementations receive dedicated IDs. */
export interface DataContractImplementationRecord<
    TConfig extends DataContractImplementationConfig = DataContractImplementationConfig,
> extends DataContractImplementationDefinition<TConfig> {
    id: DataContractImplementationId;
    dataContractId: import("./identity").DataContractId;
}

/** Couples each registered built-in kind to its configuration after validation. */
export type BuiltInDataContractImplementationDefinition = {
    [Type in DataContractImplementationType]:
        DataContractImplementationDefinition<DataContractImplementationConfigMap[Type]> & {
            type: Type;
        };
}[DataContractImplementationType];
