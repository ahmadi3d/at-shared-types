import type { AtJsonValue } from "../../core/domain/json.types";
import type { DataContractValidationIssue } from "./validation";

export interface DataContractMockGenerationOptions {
    mode: "ai" | "deterministic";
    collectionSize: number;
    /** Synthetic, representative input only. Never customer records. */
    input?: AtJsonValue;
    domainHint?: string;
}

/** A design-time candidate; generation never writes the contract. */
export interface DataContractMockCandidate {
    source: "ai" | "deterministic";
    text: string;
    value?: AtJsonValue;
    valid: boolean;
    issues: DataContractValidationIssue[];
    fallbackReason?: "engine-unavailable";
}
