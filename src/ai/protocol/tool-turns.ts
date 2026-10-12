import type { AiJsonSchema } from "./platform-schemas";
import { AiPageContextSchema, AiVersionedPayloadSchema } from "./platform-schemas";

const id = { type: "string", pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$" };
const key = { type: "string", pattern: "^[a-z][a-z0-9._-]{0,149}$" };
const version = { type: "integer", minimum: 1, maximum: 2147483647 };
const object = (properties: Record<string, AiJsonSchema>, required = Object.keys(properties)): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    properties,
    required,
});
const envelope = { contractVersion: { const: 1 }, id, traceId: id };
const correlation = { commandId: id, toolCallId: id, stepId: id, actionId: key, actionVersion: version };

export const AiEditorProposalSchema = object({
    text: { type: "string", maxLength: 2000 },
    actionId: key,
    actionVersion: version,
    expectedPage: {
        ...AiPageContextSchema,
        required: ["pageId", "integrationVersion", "editorRevision", "integrationFingerprint"],
    },
    suggestion: { oneOf: [AiVersionedPayloadSchema, { type: "null" }] },
});

export const AiTurnOutcomeSchema = object(
    {
        status: {
            enum: [
                "completed",
                "partial_success",
                "approval_required",
                "denied",
                "missing_tool",
                "migration_required",
                "stale_context",
                "repair_required",
                "cancelled",
                "approval_expired",
                "tool_unavailable",
                "provider_refused",
                "quota_blocked",
                "spend_blocked",
                "lease_lost",
                "manual_review",
                "limit_reached",
            ],
        },
        code: { type: "string", pattern: "^[A-Z][A-Z0-9_]{0,99}$" },
        modelCalls: { type: "integer", minimum: 0, maximum: 8 },
        usedSteps: { type: "integer", minimum: 0, maximum: 32 },
        completedTools: { type: "integer", minimum: 0, maximum: 32 },
        text: { type: "string", maxLength: 8000 },
        repair: { enum: ["none", "review_input", "reopen_page", "update_integration", "review_receipt", "wait"] },
        approvalId: id,
    },
    ["status", "code", "modelCalls", "usedSteps", "completedTools", "text", "repair"],
);

export const AiForegroundRequestSchema = object({
    ...envelope,
    ...correlation,
    mode: { const: "assist" },
    expectedPage: {
        ...AiPageContextSchema,
        required: ["pageId", "integrationVersion", "editorRevision", "integrationFingerprint"],
    },
    input: AiVersionedPayloadSchema,
    timeoutMs: { type: "integer", minimum: 1, maximum: 30000 },
});

const ack = { ...envelope, ...correlation, requestId: id };
export const AiForegroundAckSchema: AiJsonSchema = {
    oneOf: [
        object({
            ...ack,
            status: { const: "applied" },
            editorRevision: { type: "string", pattern: "^[1-9][0-9]{0,18}$" },
            undoToken: { type: "string", minLength: 1, maxLength: 200 },
        }),
        object({ ...ack, status: { enum: ["inactive", "stale", "denied", "cancelled", "unsupported", "failed"] } }),
    ],
};
