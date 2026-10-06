import type { ResponseErrorDto } from "../src/core/transport/responses";
import type { AtApiErrorCode, AtLegacyApiErrorCode } from "../src/protocol";

const semantic: ResponseErrorDto = {
    code: "WORKFLOW_START_SCOPE_DENIED",
    timestamp: "1791234567890000007",
    message: "Resolved scope is outside effective authority.",
    details: { authorization: { decision: "deny" } },
};

const hidden: ResponseErrorDto = {
    code: "REGIONAL_SCOPE_REQUIRED",
    timestamp: "1791234567890000008",
};

const legacyCode: AtLegacyApiErrorCode = 4501;
const legacy: ResponseErrorDto = { code: legacyCode, timestamp: "1791234567890000009" };
const codes: AtApiErrorCode[] = [semantic.code, hidden.code, legacy.code];

// A numeric reference cannot represent the exact support occurrence identifier.
const invalid: ResponseErrorDto = {
    code: "WORKFLOW_EXECUTION_FAILED",
    // @ts-expect-error References must remain exact strings in transport contracts.
    timestamp: 1791234567890000007,
};

void codes;
void invalid;
