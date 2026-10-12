const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
    AiTurnOutcomeSchema,
    AiEditorProposalSchema,
    AiForegroundRequestSchema,
    AiForegroundAckSchema,
    AiToolDescriptorSchema,
    validateAiProtocol,
} = require("../dist/protocol.cjs");
const id = "00000000-0000-0000-0000-000000000001";
const structural = { resolve: () => ({ status: "supported", validate: () => true }) };
const request = () => ({
    contractVersion: 1,
    id,
    traceId: id,
    commandId: id,
    toolCallId: id,
    stepId: id,
    mode: "assist",
    actionId: "example.fill",
    actionVersion: 1,
    expectedPage: {
        pageId: "example-page",
        integrationVersion: 1,
        editorRevision: "1",
        integrationFingerprint: "a".repeat(64),
    },
    input: { schemaId: "example.input", schemaVersion: 1, payload: {} },
    timeoutMs: 1000,
});
test("editor suggestions are closed revision-bound data and validate their owning input contract", () => {
    const value = {
        text: "Review this change.",
        actionId: "example.fill",
        actionVersion: 1,
        expectedPage: request().expectedPage,
        suggestion: request().input,
    };
    assert.equal(validateAiProtocol(AiEditorProposalSchema, value, structural).status, "valid");
    assert.equal(
        validateAiProtocol(AiEditorProposalSchema, { ...value, suggestion: null }, structural).status,
        "valid",
    );
    for (const invalid of [
        { ...value, authorized: true },
        { ...value, actionVersion: 0 },
        { ...value, expectedPage: { pageId: "example-page", integrationVersion: 1 } },
        { ...value, suggestion: { ...value.suggestion, execute: true } },
    ])
        assert.equal(validateAiProtocol(AiEditorProposalSchema, invalid, structural).status, "invalid");
    const rejected = { resolve: () => ({ status: "supported", validate: () => false }) };
    assert.equal(validateAiProtocol(AiEditorProposalSchema, value, rejected).status, "invalid");
});
test("foreground requests are closed Assist envelopes with a versioned current editor contract", () => {
    assert.equal(validateAiProtocol(AiForegroundRequestSchema, request(), structural).status, "valid");
    for (const value of [
        { ...request(), mode: "delegate" },
        { ...request(), authorized: true },
        { ...request(), expectedPage: { pageId: "example-page", integrationVersion: 1 } },
        { ...request(), timeoutMs: 30001 },
    ])
        assert.equal(validateAiProtocol(AiForegroundRequestSchema, value, structural).status, "invalid");
    assert.equal(
        validateAiProtocol(AiForegroundRequestSchema, { ...request(), contractVersion: 2 }, structural).status,
        "unsupported_version",
    );
});
test("applied acknowledgment requires an undo receipt and closed non-applied statuses cannot claim success", () => {
    const { input, expectedPage, timeoutMs, mode, ...common } = request();
    const ack = { ...common, requestId: id, status: "applied", editorRevision: "2", undoToken: "undo-1" };
    assert.equal(validateAiProtocol(AiForegroundAckSchema, ack).status, "valid");
    assert.equal(
        validateAiProtocol(AiForegroundAckSchema, { ...common, requestId: id, status: "applied" }).status,
        "invalid",
    );
    for (const status of ["inactive", "stale", "denied", "cancelled", "unsupported", "failed"]) {
        assert.equal(validateAiProtocol(AiForegroundAckSchema, { ...common, requestId: id, status }).status, "valid");
        assert.equal(validateAiProtocol(AiForegroundAckSchema, { ...ack, status }).status, "invalid");
    }
});
test("turn outcome cards carry bounded safe categories rather than executable repair commands", () => {
    const value = {
        status: "migration_required",
        code: "AI_TOOL_VERSION_UNSUPPORTED",
        modelCalls: 1,
        usedSteps: 1,
        completedTools: 0,
        text: "",
        repair: "update_integration",
    };
    assert.equal(validateAiProtocol(AiTurnOutcomeSchema, value).status, "valid");
    for (const invalid of [
        { ...value, sql: "select 1" },
        { ...value, modelCalls: 9 },
        { ...value, usedSteps: 33 },
        { ...value, repair: "run_script" },
        { ...value, code: "Raw provider error" },
    ])
        assert.equal(validateAiProtocol(AiTurnOutcomeSchema, invalid).status, "invalid");
});
test("tool ownership and migration metadata are inert closed repository-relative paths", () => {
    const descriptor = {
        id: "example.read",
        version: 1,
        description: "Read",
        risk: "read",
        allowedModes: ["ask"],
        requiredPermissionKeys: ["fixture.resource.read"],
        execution: "server",
        resourceScope: "application",
        pageIds: [],
        timeoutMs: 1000,
        idempotency: "read_only",
        inputSchemaId: "example.input",
        inputSchemaVersion: 1,
        outputSchemaId: "example.output",
        outputSchemaVersion: 1,
        lifecycle: "deprecated",
        owner: {
            backend: "src/app/ai/domains/example/tool.ts",
            schema: "src/app/ai/domains/example/schema.ts",
            fixtures: ["src/app/ai/domains/example/tests/fixture.ts"],
        },
        migration: {
            replacementToolId: "example.new-read",
            replacementVersion: 2,
            guidance: "Update the owning integration.",
        },
    };
    assert.equal(validateAiProtocol(AiToolDescriptorSchema, descriptor).status, "valid");
    for (const backend of ["../escape.ts", "/absolute.ts", "C:/absolute.ts", "src/../escape.ts"])
        assert.equal(
            validateAiProtocol(AiToolDescriptorSchema, { ...descriptor, owner: { ...descriptor.owner, backend } })
                .status,
            "invalid",
        );
});
