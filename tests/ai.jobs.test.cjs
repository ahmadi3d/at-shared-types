const assert = require("node:assert/strict");
const { test } = require("node:test");
const {
    AiJobControlCommandSchema,
    AiApprovalReviewSchema,
    AiApprovalDecisionReceiptSchema,
    AiDiagnosticResultSchema,
    AiJobResultSchema,
    AiManagerProjectionRequestSchema,
    AiManagerProjectionRowSchema,
    AiManagerProjectionPageSchema,
    validateAiProtocol,
} = require("../dist/protocol.cjs");
const id = "00000000-0000-0000-0000-000000000001";
const valid = (schema, value, registry) => validateAiProtocol(schema, value, registry).status === "valid";

test("manager pages remain closed and bound independent catalog and task cursors", () => {
    const page = { rows: [], recordTotal: null, next: { recordsOffset: null, jobsOffset: 50 } };
    assert.ok(valid(AiManagerProjectionPageSchema, page));
    for (const invalid of [
        { ...page, ownerId: "other-user" },
        { ...page, next: { ...page.next, jobsOffset: 100001 } },
        { ...page, recordTotal: "unknown" },
        {
            ...page,
            rows: [
                {
                    identity: "resource:form:14",
                    kind: "resource",
                    record: {
                        resourceType: "form",
                        resourceId: "14",
                        label: "Allowed form",
                        privateDefinition: {},
                    },
                },
            ],
        },
    ])
        assert.equal(valid(AiManagerProjectionPageSchema, invalid), false);
});

test("human approval review carries exact inert diff, closed risk/action and a correlated decision receipt", () => {
    const approval = {
        id,
        jobId: id,
        conversationId: id,
        toolCallId: id,
        toolId: "fixture.update",
        toolVersion: 1,
        resource: { resourceType: "form", resourceId: "14", revision: "3", schemaVersion: 3 },
        actionDigest: "a".repeat(64),
        state: "pending",
        revision: "1",
        expiresAt: "2026-10-12T00:00:00Z",
    };
    const review = {
        approval,
        kind: "update",
        risk: "modify",
        change: { schemaId: "fixture.review", schemaVersion: 1, payload: { before: "Before", after: "After" } },
    };
    const display = { resolve: () => ({ status: "supported", validate: () => true }) };
    assert.equal(validateAiProtocol(AiApprovalReviewSchema, review, display).status, "valid");
    for (const source of [
        { ...review, input: {} },
        { ...review, kind: "execute_sql" },
        { ...review, risk: "admin_bypass" },
    ])
        assert.notEqual(validateAiProtocol(AiApprovalReviewSchema, source, display).status, "valid");
    assert.ok(
        valid(
            AiApprovalDecisionReceiptSchema,
            {
                receipt: { id, revision: "2" },
                approval: { ...approval, state: "approved", revision: "2" },
            },
            display,
        ),
    );
});

test("diagnostic evidence distinguishes certainty and forbids executable links or raw exceptions", () => {
    const result = {
        contractVersion: 1,
        code: "AI_RESOURCE_CHANGED",
        category: "conflict",
        summary: "The saved resource changed.",
        findings: [
            {
                certainty: "hypothesis",
                code: "AI_RESOURCE_CHANGED",
                message: "Read the latest version.",
                source: "fixture.policy",
            },
        ],
        citations: [],
        navigation: [],
    };
    assert.ok(valid(AiDiagnosticResultSchema, result));
    for (const source of [
        { ...result, stack: "private" },
        { ...result, navigation: [{ target: "url", id: "javascript" }] },
        { ...result, findings: [{ ...result.findings[0], certainty: "guaranteed" }] },
    ])
        assert.ok(!valid(AiDiagnosticResultSchema, source));
});

test("job controls carry exact command identity and revision without browser authority", () => {
    const command = { contractVersion: 1, id, traceId: id, commandId: id, jobId: id, expectedRevision: "1" };
    assert.ok(valid(AiJobControlCommandSchema, command));
    for (const extra of [{ canRetry: true }, { userId: "7" }, { workerId: id }, { effectId: id }])
        assert.ok(!valid(AiJobControlCommandSchema, { ...command, ...extra }));
    assert.ok(!valid(AiJobControlCommandSchema, { ...command, expectedRevision: "0" }));
});

test("durable results use bounded versioned resource references rather than executable links", () => {
    const artifact = {
        resource: { resourceType: "form", resourceId: "12", revision: "native:1", schemaVersion: 3 },
        label: "Draft",
    };
    const result = {
        contractVersion: 1,
        completedAt: "2026-10-11T00:00:00.000Z",
        artifacts: [artifact],
        outcome: {
            status: "completed",
            code: "AI_TURN_COMPLETED",
            modelCalls: 0,
            usedSteps: 1,
            completedTools: 1,
            text: "Saved draft.",
            repair: "none",
        },
    };
    assert.ok(valid(AiJobResultSchema, result));
    assert.ok(!valid(AiJobResultSchema, { ...result, artifacts: [{ ...artifact, url: "javascript:run()" }] }));
    assert.ok(!valid(AiJobResultSchema, { ...result, artifacts: Array(33).fill(artifact) }));
    assert.ok(
        !valid(AiJobResultSchema, {
            ...result,
            artifacts: [{ resource: { resourceType: "form", resourceId: "12" }, label: "Draft" }],
        }),
    );
});

test("manager lookup records have separate identities and bounded independent cursors", () => {
    const row = {
        identity: "resource:form:12",
        kind: "resource",
        record: { resourceType: "form", resourceId: "12", label: "Draft" },
        jobId: id,
    };
    assert.ok(valid(AiManagerProjectionRowSchema, row));
    assert.ok(!valid(AiManagerProjectionRowSchema, { ...row, record: { ...row.record, definition: {} } }));
    assert.ok(!valid(AiManagerProjectionRowSchema, { ...row, identity: `job:${id}` }));
    const page = { recordsOffset: 0, jobsOffset: 4, limit: 20 };
    assert.ok(valid(AiManagerProjectionRequestSchema, page));
    for (const invalid of [
        { ...page, limit: 101 },
        { ...page, jobsOffset: -1 },
        { ...page, offset: 1 },
    ])
        assert.ok(!valid(AiManagerProjectionRequestSchema, invalid));
});
