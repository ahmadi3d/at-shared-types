const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
    AiMessageCommandSchema,
    AiMessageCommandWireSchema,
    AiStreamEventSchema,
    AiStreamEventWireSchema,
    AiToolProposalSchema,
    AiToolDescriptorSchema,
    AiModelDisplaySchema,
    AiApprovalDecisionSchema,
    AiProgressSchema,
    AiToolResultSchema,
    aiWireSchema,
    validateAiProtocol,
} = require("../dist/protocol.cjs");

const id = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const command = {
    contractVersion: 1, id, traceId: id, commandId: id, conversationId: id,
    expectedRevision: "1", mode: "ask", text: "Explain this page",
};
const event = {
    contractVersion: 1, id, traceId: id, conversationId: id, sequence: "1",
    occurredAt: "2026-10-10T12:00:00Z", kind: "message.delta", data: { messageId: id, text: "Hello" },
};
const proposal = {
    contractVersion: 1, id, traceId: id, toolCallId: id, stepId: id,
    toolId: "form.create-draft", toolVersion: 1,
    input: { schemaId: "form.draft-input", schemaVersion: 1, payload: { formTitle: "Draft" } },
};
const registry = {
    resolve(schemaId, version) {
        if (version === 2) return { status: "migration_required" };
        if (version !== 1) return { status: "unsupported_version" };
        if (schemaId === "ai.tool.form.create-draft") return { status: "supported", validate: () => true };
        if (schemaId === "form.draft-input") return {
            status: "supported",
            validate: value => Object.keys(value).join(",") === "formTitle" && typeof value.formTitle === "string",
        };
        return { status: "unsupported_version" };
    },
};

test("strict commands/events accept valid domain and snake-case wire envelopes", () => {
    assert.equal(validateAiProtocol(AiMessageCommandSchema, command).status, "valid");
    assert.equal(validateAiProtocol(AiStreamEventSchema, event).status, "valid");
    assert.equal(validateAiProtocol(AiMessageCommandWireSchema, {
        contract_version: 1, id, trace_id: id, command_id: id, conversation_id: id,
        expected_revision: "1", mode: "ask", text: "Explain",
    }).status, "valid");
    assert.equal(validateAiProtocol(AiStreamEventWireSchema, {
        contract_version: 1, id, trace_id: id, conversation_id: id, sequence: "1",
        occurred_at: event.occurredAt, kind: "message.delta", data: { message_id: id, text: "Hello" },
    }).status, "valid");
});

test("effort has closed protocol values and cannot select a provider or model", () => {
    for (const effort of ["low", "medium", "high"]) {
        assert.equal(validateAiProtocol(AiMessageCommandSchema, { ...command, effort }).status, "valid");
    }
    for (const effort of ["deep", "balanced", "", 1, null]) {
        assert.equal(validateAiProtocol(AiMessageCommandSchema, { ...command, effort }).status, "invalid");
    }
    assert.equal(validateAiProtocol(AiMessageCommandSchema, { ...command, effort: "high", model: "injected" }).status, "invalid");
});

test("unversioned/legacy/unknown fields, events, wrong types and raw context reject", () => {
    for (const value of [
        { messages: [{ role: "user", content: "Old demo" }] },
        { ...command, options: { model: "expensive" } },
        { ...command, text: 42 },
        { ...command, mode: "execute-sql" },
        { ...command, pageContext: { pageId: "api-manager", integrationVersion: 1, data: {} } },
        { ...command, text: "x".repeat(16001) },
    ]) assert.equal(validateAiProtocol(AiMessageCommandSchema, value).status, "invalid");
    assert.equal(validateAiProtocol(AiStreamEventSchema, { ...event, kind: "execute.javascript" }).status, "invalid");
    assert.equal(validateAiProtocol(AiStreamEventSchema, { ...event, data: { messageId: id, text: "Hello", script: "alert(1)" } }).status, "invalid");
});

test("protocol, tool and domain payload versions have explicit unsupported/migration outcomes", () => {
    assert.deepEqual(validateAiProtocol(AiMessageCommandSchema, { ...command, contractVersion: 2 }), {
        status: "unsupported_version", schemaId: "ai.protocol", schemaVersion: 2,
    });
    assert.equal(validateAiProtocol(AiToolProposalSchema, proposal, registry).status, "valid");
    assert.equal(validateAiProtocol(AiToolProposalSchema, { ...proposal, toolVersion: 2 }, registry).status, "migration_required");
    assert.equal(validateAiProtocol(AiToolProposalSchema, { ...proposal, input: { ...proposal.input, schemaVersion: 99 } }, registry).status,
        "unsupported_version");
    assert.equal(validateAiProtocol(AiToolProposalSchema, { ...proposal, input: { ...proposal.input, payload: { oldTitle: "Draft" } } }, registry).status,
        "invalid");
    assert.equal(validateAiProtocol(AiToolProposalSchema, proposal).status, "unsupported_version");
    assert.equal(validateAiProtocol(AiToolProposalSchema, proposal, {
        resolve() { throw new Error("Registry cannot compile this version."); },
    }).status, "invalid");
});

test("wire transformation preserves schema IDs and domain payload casing", () => {
    const wire = {
        contract_version: 1, id, trace_id: id, tool_call_id: id, step_id: id,
        tool_id: "form.create-draft", tool_version: 1,
        input: { schema_id: "form.draft-input", schema_version: 1, payload: { formTitle: "Draft" } },
    };
    assert.equal(validateAiProtocol(aiWireSchema(AiToolProposalSchema), wire, registry).status, "valid");
    assert.equal(validateAiProtocol(aiWireSchema(AiToolProposalSchema), {
        ...wire, input: { ...wire.input, payload: { form_title: "Draft" } },
    }, registry).status, "invalid");
});

test("public metadata forbids private provider fields and approval decisions bind digest/revision", () => {
    const model = { id: "fast", label: "Fast", supportsStreaming: true, supportsStructuredOutput: true, supportsToolProposals: true };
    assert.equal(validateAiProtocol(AiModelDisplaySchema, model).status, "valid");
    assert.equal(validateAiProtocol(AiModelDisplaySchema, { ...model, providerConfig: { apiKey: "private" } }).status, "invalid");
    const decision = {
        contractVersion: 1, id, traceId: id, commandId: id, approvalId: id,
        expectedRevision: "1", actionDigest: "a".repeat(64), decision: "approve",
    };
    assert.equal(validateAiProtocol(AiApprovalDecisionSchema, decision).status, "valid");
    assert.equal(validateAiProtocol(AiApprovalDecisionSchema, { ...decision, actionDigest: "" }).status, "invalid");
    assert.equal(validateAiProtocol(AiApprovalDecisionSchema, { ...decision, expectedRevision: 1 }).status, "invalid");
});

test("oversized, cyclic, accessor, prototype and non-JSON input rejects without invoking getters", () => {
    const cyclic = {}; cyclic.self = cyclic;
    let reads = 0;
    const accessor = { get value() { reads++; throw new Error("Do not invoke."); } };
    for (const value of [cyclic, accessor, JSON.parse('{"__proto__":{}}'), { fn() {} }, new Date(), new Array(1000000)]) {
        assert.equal(validateAiProtocol(AiMessageCommandSchema, value).status, "invalid");
    }
    assert.equal(reads, 0);
    assert.equal(validateAiProtocol(AiMessageCommandSchema, { ...command, text: "x".repeat(65537) }).status, "invalid");
});

test("progress counters are bounded and unknown totals remain explicit", () => {
    assert.equal(validateAiProtocol(AiProgressSchema, { phase: "planning", completedSteps: 0, totalSteps: null, message: "" }).status, "valid");
    assert.equal(validateAiProtocol(AiProgressSchema, { phase: "planning", completedSteps: -1, totalSteps: null, message: "" }).status, "invalid");
    assert.equal(validateAiProtocol(AiProgressSchema, { phase: "planning", completedSteps: 2, totalSteps: 1, message: "" }).status, "invalid");
});

test("tool results require typed success output or validation issues", () => {
    const result = {
        contractVersion: 1, id, traceId: id, toolCallId: id, stepId: id,
        toolId: "form.create-draft", toolVersion: 1,
    };
    assert.equal(validateAiProtocol(AiToolResultSchema, { ...result, outcome: "ok" }, registry).status, "invalid");
    assert.equal(validateAiProtocol(AiToolResultSchema, { ...result, outcome: "validation_failed" }, registry).status, "invalid");
    assert.equal(validateAiProtocol(AiToolResultSchema, {
        ...result, outcome: "ok", output: proposal.input,
    }, registry).status, "valid");
    assert.equal(validateAiProtocol(AiToolResultSchema, {
        ...result, outcome: "validation_failed", issues: [{ path: "title", code: "REQUIRED", message: "Title is required." }],
    }, registry).status, "valid");
});

test("tool descriptors include closed execution, resource, timeout and idempotency policy", () => {
    const descriptor = {
        id: "fixture.read", version: 1, description: "Read selected metadata", risk: "read", allowedModes: ["ask"],
        requiredPermissionKeys: ["fixture.resource.read"], execution: "server", resourceScope: "resource", resourceType: "fixture",
        pageIds: ["fixture-page"], pageIntegrationVersion: 1, timeoutMs: 5000, idempotency: "read_only",
        inputSchemaId: "fixture.input", inputSchemaVersion: 1, outputSchemaId: "fixture.output", outputSchemaVersion: 1,
    };
    assert.equal(validateAiProtocol(AiToolDescriptorSchema, descriptor).status, "valid");
    for (const change of [{ timeoutMs: 120001 }, { idempotency: "none" }, { execution: "javascript" },
        { requiredPermissionKeys: [] }, { pageIds: ["fixture-page", "fixture-page"] }, { execute: "arbitrary" }])
        assert.equal(validateAiProtocol(AiToolDescriptorSchema, { ...descriptor, ...change }).status, "invalid");
});
