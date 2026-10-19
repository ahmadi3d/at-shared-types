import type { AtJsonValue } from "../../core/domain/json.types";
import type {
    DataContractId,
    DataContractImplementationId,
    DataContractReference,
    DataContractVersion,
} from "./identity";

/** Request understood by the shared Data Contract service/runtime boundary. */
export interface DataContractInvocationRequest extends DataContractReference {
    input: AtJsonValue;
    /** Restricts this invocation after alias resolution; never grants execution permission. */
    expectedEffect?: "read" | "write";
}

/** Indicates whether the response came from mock generation or a real binding. */
export type DataContractInvocationMode = "mock" | "implementation";

/** Runtime metadata useful for diagnostics without polluting business output. */
export interface DataContractInvocationMetadata {
    dataContractId: DataContractId;
    version: DataContractVersion;
    mode: DataContractInvocationMode;
    /** Preserves simulation provenance through normal runtime execution. */
    origin?: "implementation" | "mock" | "mock-fallback";
    effect?: "read" | "write";
    implementationId?: DataContractImplementationId;
}

/** Successful result of invoking a Data Contract. */
export interface DataContractInvocationResult {
    data: AtJsonValue;
    metadata: DataContractInvocationMetadata;
}
