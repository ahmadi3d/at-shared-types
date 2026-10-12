const assert = require("node:assert/strict");
const { test } = require("node:test");
const { AiResourceConflictReviewSchema, validateAiProtocol } = require("../dist/protocol.cjs");
const id = "00000000-0000-0000-0000-000000000001";
const resource = { resourceType: "example", resourceId: "19", revision: "1", schemaVersion: 1 };
const change = { schemaId: "example.diff", schemaVersion: 1, payload: { before: "Base", after: "Proposed" } };
const review = {
    contractVersion: 1,
    approvalId: id,
    jobId: id,
    commandId: id,
    status: "conflict",
    base: resource,
    current: { ...resource, revision: "2" },
    originalChange: change,
    currentChange: { ...change, payload: { before: "Current", after: "Proposed" } },
    resolution: "new_preview_required",
};
const registry = {
    resolve: (schemaId, version) =>
        schemaId === "example.diff" && version === 1
            ? {
                  status: "supported",
                  validate: (value) => typeof value.before === "string" && typeof value.after === "string",
              }
        : { status: "unsupported_version" },
};
test("conflict reviews pair closed native diffs with explicit re-preview rather than overwrite authority", () => {
    assert.equal(validateAiProtocol(AiResourceConflictReviewSchema, review, registry).status, "valid");
    for (const invalid of [
        { ...review, resolution: "none" },
        { ...review, merge: true },
        { ...review, currentChange: { ...change, payload: { before: "Current", after: 7 } } },
    ])
        assert.equal(validateAiProtocol(AiResourceConflictReviewSchema, invalid, registry).status, "invalid");
    assert.equal(
        validateAiProtocol(
            AiResourceConflictReviewSchema,
            { ...review, currentChange: { ...change, schemaVersion: 2 } },
            registry,
        ).status,
        "unsupported_version",
    );
});
