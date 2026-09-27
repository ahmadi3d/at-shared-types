import type { AtJsonValue } from "../../core/domain/json.types";
import type {
    DataContractId,
    DataContractImplementationId,
    DataContractVersion,
} from "./identity";

/** Request understood by the shared Data Contract service/runtime boundary. */
export interface DataContractInvocationRequest {
    dataContractId: DataContractId;
    version: DataContractVersion;
    input: AtJsonValue;
}

/** Indicates whether the response came from mock generation or a real binding. */
export type DataContractInvocationMode = "mock" | "implementation";

/** Runtime metadata useful for diagnostics without polluting business output. */
export interface DataContractInvocationMetadata {
    dataContractId: DataContractId;
    version: DataContractVersion;
    mode: DataContractInvocationMode;
    implementationId?: DataContractImplementationId;
}

/** Successful result of invoking a Data Contract. */
export interface DataContractInvocationResult {
    data: AtJsonValue;
    metadata: DataContractInvocationMetadata;
}
