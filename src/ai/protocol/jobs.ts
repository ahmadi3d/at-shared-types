import type { AiJsonSchema } from "./platform-schemas";
import { AiApprovalSchema, AiJobSchema, AiResourceReferenceSchema, AiVersionedPayloadSchema } from "./platform-schemas";
import { AiTurnOutcomeSchema } from "./tool-turns";

const id = {
    type: "string",
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
} as const;
const object = (properties: Record<string, AiJsonSchema>, required = Object.keys(properties)): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    properties,
    required,
});
const key: AiJsonSchema = { type: "string", pattern: "^[a-z][a-z0-9._-]{0,99}$" };

export const AiJobArtifactSchema = object({
    resource: AiResourceReferenceSchema,
    label: { type: "string", minLength: 1, maxLength: 200 },
});

export const AiJobResultSchema = object({
    contractVersion: { const: 1 },
    outcome: AiTurnOutcomeSchema,
    artifacts: { type: "array", maxItems: 32, items: AiJobArtifactSchema },
    completedAt: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$" },
});

export const AiJobDetailSchema = object({
    job: AiJobSchema,
    attempts: { type: "integer", minimum: 0, maximum: 2147483647 },
    canRetry: { type: "boolean" },
    failureCode: { oneOf: [{ type: "string", pattern: "^[A-Z][A-Z0-9_]{0,99}$" }, { type: "null" }] },
    result: { oneOf: [AiJobResultSchema, { type: "null" }] },
    approvals: { type: "array", maxItems: 100, items: AiApprovalSchema },
});

export const AiJobControlCommandSchema = object({
    contractVersion: { const: 1 },
    id,
    traceId: id,
    commandId: id,
    jobId: id,
    expectedRevision: { type: "string", pattern: "^[1-9][0-9]{0,18}$" },
});

export const AiJobListFilterSchema = object(
    {
        conversationId: id,
        state: {
            enum: [
                "queued",
                "running",
                "waiting_approval",
                "retry_wait",
                "cancelling",
                "cancelled",
                "succeeded",
                "failed",
                "manual_review",
            ],
        },
        resourceType: key,
        taskClass: key,
    },
    [],
);

export const AiApprovalReviewSchema = object({
    approval: AiApprovalSchema,
    kind: {
        enum: [
            "create_draft",
            "update",
            "delete",
            "archive",
            "publish",
            "business_write",
            "workflow_start",
            "script_activate",
        ],
    },
    risk: { enum: ["read", "transient", "draft", "modify", "publish", "business_write"] },
    change: AiVersionedPayloadSchema,
});
export const AiApprovalDecisionReceiptSchema = object({
    receipt: object({ id, revision: { type: "string", pattern: "^[1-9][0-9]{0,18}$" } }),
    approval: AiApprovalSchema,
});

export const AiManagerProjectionRowSchema: AiJsonSchema = {
    oneOf: [
        object({
            identity: { type: "string", pattern: "^job:[0-9a-f-]{36}$" },
            kind: { const: "job" },
            detail: AiJobDetailSchema,
        }),
        object(
            {
                identity: { type: "string", minLength: 12, maxLength: 1000, pattern: "^resource:" },
                kind: { const: "resource" },
                record: object({
                    resourceType: key,
                    resourceId: { type: "string", minLength: 1, maxLength: 200 },
                    label: { type: "string", minLength: 1, maxLength: 200 },
                }),
                jobId: id,
            },
            ["identity", "kind", "record"],
        ),
    ],
};

export const AiManagerProjectionRequestSchema = object({
    recordsOffset: { type: "integer", minimum: 0, maximum: 100000 },
    jobsOffset: { type: "integer", minimum: 0, maximum: 100000 },
    limit: { type: "integer", minimum: 1, maximum: 100 },
});

export const AiManagerProjectionPageSchema = object({
    rows: { type: "array", maxItems: 200, items: AiManagerProjectionRowSchema },
    recordTotal: { oneOf: [{ type: "string", pattern: "^(0|[1-9][0-9]{0,18})$" }, { type: "null" }] },
    next: object({
        recordsOffset: { oneOf: [{ type: "integer", minimum: 0, maximum: 100000 }, { type: "null" }] },
        jobsOffset: { oneOf: [{ type: "integer", minimum: 0, maximum: 100000 }, { type: "null" }] },
    }),
});
