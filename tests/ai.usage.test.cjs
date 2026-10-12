const assert = require("node:assert/strict");
const { test } = require("node:test");
const { AiSelfUsageSchema, validateAiProtocol } = require("../dist/protocol.cjs");

test("self usage retains unknown amounts and rejects operator data", () => {
    const value = { contractVersion: 1, individualAllowance: "enforced", total: "1", records: [{
        id: "00000000-0000-4000-8000-000000000001", state: "ambiguous", estimatedMicroUsd: "420",
        actualMicroUsd: null, inputTokens: null, outputTokens: null, createdAt: "2026-10-11T00:00:00Z",
    }] };
    assert.equal(validateAiProtocol(AiSelfUsageSchema, value).status, "valid");
    assert.equal(validateAiProtocol(AiSelfUsageSchema, { ...value, credential: "forbidden" }).status, "invalid");
    assert.equal(validateAiProtocol(AiSelfUsageSchema, { ...value, records: [{ ...value.records[0], providerConfig: {} }] }).status, "invalid");
});
