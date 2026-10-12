/** Closed protocol schemas. Business payloads are validated by their owning versioned registry. */
export interface AiJsonSchema {
    type?: string | string[];
    const?: unknown;
    enum?: readonly unknown[];
    properties?: Record<string, AiJsonSchema>;
    required?: readonly string[];
    additionalProperties?: boolean;
    items?: AiJsonSchema;
    minItems?: number;
    maxItems?: number;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    pattern?: string;
    oneOf?: AiJsonSchema[];
    uniqueItems?: boolean;
}

const object = (properties: Record<string, AiJsonSchema>, required = Object.keys(properties)): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    properties,
    required,
});
const array = (items: AiJsonSchema, maxItems: number, minItems = 0): AiJsonSchema => ({
    type: "array",
    items,
    minItems,
    maxItems,
});
const text = (maxLength: number, minLength = 1): AiJsonSchema => ({ type: "string", minLength, maxLength });
const positive: AiJsonSchema = { type: "integer", minimum: 1, maximum: 2147483647 };
const count: AiJsonSchema = { type: "integer", minimum: 0, maximum: 2147483647 };
const decimal: AiJsonSchema = { type: "string", pattern: "^[1-9][0-9]{0,18}$" };
const money: AiJsonSchema = { type: "string", pattern: "^(0|[1-9][0-9]{0,18})$" };
const id: AiJsonSchema = {
    type: "string",
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
};
const key: AiJsonSchema = { type: "string", minLength: 1, maxLength: 150, pattern: "^[a-z][a-z0-9._-]*$" };
const timestamp: AiJsonSchema = {
    type: "string",
    pattern:
        "^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]{1,7})?Z$",
};
const digest: AiJsonSchema = { type: "string", pattern: "^[0-9a-f]{64}$" };
const mode: AiJsonSchema = { enum: ["ask", "assist", "delegate"] };
const jobState: AiJsonSchema = {
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
};
const envelope = { contractVersion: { const: 1 }, id, traceId: id } satisfies Record<string, AiJsonSchema>;

export const AiResourceReferenceSchema = object({
    resourceType: key,
    resourceId: text(200),
    revision: text(100),
    schemaVersion: positive,
});
export const AiPageContextSchema = object(
    {
        pageId: key,
        integrationVersion: positive,
        resource: AiResourceReferenceSchema,
        editorRevision: text(100),
        integrationFingerprint: { type: "string", pattern: "^[0-9a-f]{64}$" },
    },
    ["pageId", "integrationVersion"],
);
export const AiVersionedPayloadSchema = object({
    schemaId: key,
    schemaVersion: positive,
    payload: { type: "object", additionalProperties: true },
});
export const AiValidationIssueSchema = object({ path: text(300, 0), code: text(100), message: text(500) });
const issues = array(AiValidationIssueSchema, 32, 1);
export const AiUsageSchema = object({
    inputTokens: count,
    outputTokens: count,
    estimatedMicroUsd: money,
    actualMicroUsd: { oneOf: [money, { type: "null" }] },
});
export const AiModelDisplaySchema = object({
    id: key,
    label: text(150),
    supportsStreaming: { type: "boolean" },
    supportsStructuredOutput: { type: "boolean" },
    supportsToolProposals: { type: "boolean" },
});
export const AiAccessSchema = object({
    enabled: { type: "boolean" },
    isAdmin: { type: "boolean" },
    allowedModes: { ...array(mode, 3), uniqueItems: true },
    effortSelectable: { type: "boolean" },
    defaultEffort: { const: "low" },
});
export const AiQuotaOutcomeSchema = object({
    allowed: { type: "boolean" },
    reason: {
        enum: [
            "allowed",
            "access_denied",
            "rate_limit",
            "period_budget",
            "job_concurrency",
            "global_budget",
            "kill_switch",
        ],
    },
    resetAt: { oneOf: [timestamp, { type: "null" }] },
});
export const AiToolDescriptorSchema = object(
    {
        id: key,
        version: positive,
        description: text(2000),
        risk: { enum: ["read", "transient", "draft", "modify", "publish", "business_write"] },
        allowedModes: { ...array(mode, 3, 1), uniqueItems: true },
        requiredPermissionKeys: {
            ...array({ type: "string", pattern: "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*){2,}$", maxLength: 150 }, 16, 1),
            uniqueItems: true,
        },
        execution: { enum: ["server", "foreground"] },
        resourceScope: { enum: ["application", "resource"] },
        resourceType: key,
        pageIds: { ...array(key, 16), uniqueItems: true },
        pageIntegrationVersion: positive,
        timeoutMs: { type: "integer", minimum: 1, maximum: 120000 },
        idempotency: { enum: ["read_only", "command", "transaction_receipt", "foreground_ack"] },
        inputSchemaId: key,
        inputSchemaVersion: positive,
        outputSchemaId: key,
        outputSchemaVersion: positive,
        owner: object({
            backend: { ...text(500), pattern: "^(?!/)(?!.*\\\\)(?!.*(?:^|/)\\.\\.(?:/|$))(?!.*:).+$" },
            schema: { ...text(500), pattern: "^(?!/)(?!.*\\\\)(?!.*(?:^|/)\\.\\.(?:/|$))(?!.*:).+$" },
            fixtures: array({ ...text(500), pattern: "^(?!/)(?!.*\\\\)(?!.*(?:^|/)\\.\\.(?:/|$))(?!.*:).+$" }, 16, 1),
        }),
        lifecycle: { enum: ["active", "deprecated"] },
        migration: object({ replacementToolId: key, replacementVersion: positive, guidance: text(500) }),
    },
    [
        "id",
        "version",
        "description",
        "risk",
        "allowedModes",
        "requiredPermissionKeys",
        "execution",
        "resourceScope",
        "pageIds",
        "timeoutMs",
        "idempotency",
        "inputSchemaId",
        "inputSchemaVersion",
        "outputSchemaId",
        "outputSchemaVersion",
    ],
);
export const AiToolProposalSchema = object(
    {
        ...envelope,
        toolCallId: id,
        stepId: id,
        toolId: key,
        toolVersion: positive,
        resource: AiResourceReferenceSchema,
        input: AiVersionedPayloadSchema,
    },
    ["contractVersion", "id", "traceId", "toolCallId", "stepId", "toolId", "toolVersion", "input"],
);
const toolResultEnvelope = {
    ...envelope,
    toolCallId: id,
    stepId: id,
    toolId: key,
    toolVersion: positive,
};
export const AiToolResultSchema: AiJsonSchema = {
    oneOf: [
        object({ ...toolResultEnvelope, outcome: { const: "ok" }, output: AiVersionedPayloadSchema }),
        object({ ...toolResultEnvelope, outcome: { const: "validation_failed" }, issues }),
        object(
            {
                ...toolResultEnvelope,
                outcome: { enum: ["refused", "unsupported_version", "migration_required", "failed"] },
                issues,
            },
            [...Object.keys(toolResultEnvelope), "outcome"],
        ),
    ],
};
export const AiResultCardSchema = object({
    ...AiVersionedPayloadSchema.properties!,
    cardId: id,
    cardType: key,
    cardVersion: positive,
});
const parts: AiJsonSchema = {
    oneOf: [
        object({ kind: { const: "text" }, text: text(16000) }),
        object({ kind: { const: "refusal" }, code: text(100), message: text(2000) }),
        object({ kind: { const: "card" }, card: AiResultCardSchema }),
        object({ kind: { const: "tool_result" }, result: AiToolResultSchema }),
    ],
};
export const AiConversationSchema = object(
    {
        id,
        title: text(200),
        mode,
        revision: decimal,
        archived: { type: "boolean" },
        createdAt: timestamp,
        updatedAt: timestamp,
    },
    ["id", "title", "mode", "revision", "createdAt", "updatedAt"],
);
export const AiMessageSchema = object({
    id,
    conversationId: id,
    commandId: id,
    sequence: decimal,
    role: { enum: ["user", "assistant", "tool"] },
    parts: array(parts, 32, 1),
    createdAt: timestamp,
});
export const AiNoteAssociationSchema: AiJsonSchema = {
    oneOf: [
        object({ conversationId: id }),
        object({
            pageContext: object(
                {
                    pageId: key,
                    integrationVersion: positive,
                    resource: AiResourceReferenceSchema,
                    integrationFingerprint: { type: "string", pattern: "^[0-9a-f]{64}$" },
                },
                ["pageId", "integrationVersion", "resource"],
            ),
        }),
    ],
};
export const AiNoteSchema = object(
    {
        id,
        title: text(200),
        text: text(16000, 0),
        pinned: { type: "boolean" },
        association: AiNoteAssociationSchema,
        revision: decimal,
        createdAt: timestamp,
        updatedAt: timestamp,
    },
    ["id", "title", "text", "pinned", "revision", "createdAt", "updatedAt"],
);
export const AiNoteCommandSchema = object(
    {
        ...envelope,
        commandId: id,
        title: text(200),
        text: text(16000, 0),
        pinned: { type: "boolean" },
        association: AiNoteAssociationSchema,
        expectedRevision: decimal,
    },
    ["contractVersion", "id", "traceId", "commandId", "title", "text", "pinned"],
);
export const AiProgressSchema = object({
    phase: key,
    completedSteps: count,
    totalSteps: { oneOf: [count, { type: "null" }] },
    message: text(500, 0),
});
export const AiJobSchema = object(
    {
        id,
        commandId: id,
        conversationId: id,
        state: jobState,
        revision: decimal,
        progress: AiProgressSchema,
        resource: AiResourceReferenceSchema,
        createdAt: timestamp,
        updatedAt: timestamp,
    },
    ["id", "commandId", "conversationId", "state", "revision", "progress", "createdAt", "updatedAt"],
);
export const AiApprovalSchema = object(
    {
        id,
        conversationId: id,
        jobId: id,
        toolCallId: id,
        toolId: key,
        toolVersion: positive,
        resource: AiResourceReferenceSchema,
        actionDigest: digest,
        state: { enum: ["pending", "approved", "denied", "expired", "invalidated"] },
        revision: decimal,
        expiresAt: timestamp,
    },
    [
        "id",
        "conversationId",
        "toolCallId",
        "toolId",
        "toolVersion",
        "resource",
        "actionDigest",
        "state",
        "revision",
        "expiresAt",
    ],
);
export const AiMessageCommandSchema = object(
    {
        ...envelope,
        commandId: id,
        conversationId: id,
        expectedRevision: decimal,
        mode,
        text: text(16000),
        effort: { enum: ["low", "medium", "high"] },
        pageContext: AiPageContextSchema,
        editorPreview: AiVersionedPayloadSchema,
    },
    ["contractVersion", "id", "traceId", "commandId", "conversationId", "expectedRevision", "mode", "text"],
);
export const AiApprovalDecisionSchema = object({
    ...envelope,
    commandId: id,
    approvalId: id,
    expectedRevision: decimal,
    actionDigest: digest,
    decision: { enum: ["approve", "deny"] },
});
export const AiPageRequestSchema = object(
    { cursor: text(1000), limit: { type: "integer", minimum: 1, maximum: 100 } },
    ["limit"],
);

const eventData: Record<string, AiJsonSchema> = {
    "message.delta": object({ messageId: id, text: text(8000, 0) }),
    "message.completed": object({ message: AiMessageSchema }),
    "tool.proposed": object({ proposal: AiToolProposalSchema }),
    "tool.completed": object({ result: AiToolResultSchema }),
    "approval.required": object({ approval: AiApprovalSchema }),
    "job.progress": object({ jobId: id, state: jobState, progress: AiProgressSchema }),
    partial_result: object({ card: AiResultCardSchema }),
    refusal: object({ code: text(100), message: text(2000) }),
    "validation.failed": object({ issues }),
    usage: object({ usage: AiUsageSchema }),
    error: object({
        code: text(100),
        outcome: { enum: ["refused", "validation_failed", "unsupported_version", "migration_required", "failed"] },
    }),
};
export const AiStreamEventSchema: AiJsonSchema = {
    oneOf: Object.entries(eventData).map(([kind, data]) =>
        object({
            ...envelope,
            conversationId: id,
            sequence: decimal,
            occurredAt: timestamp,
            kind: { const: kind },
            data,
        }),
    ),
};

/** Transform schema field names, never schema IDs, enum values or opaque payload data. */
export function aiWireSchema(schema: AiJsonSchema): AiJsonSchema {
    return {
        ...schema,
        ...(schema.properties
            ? {
                  properties: Object.fromEntries(
                      Object.entries(schema.properties).map(([name, child]) => [toSnakeStr(name), aiWireSchema(child)]),
                  ),
              }
            : {}),
        ...(schema.required ? { required: schema.required.map(toSnakeStr) } : {}),
        ...(schema.items ? { items: aiWireSchema(schema.items) } : {}),
        ...(schema.oneOf ? { oneOf: schema.oneOf.map(aiWireSchema) } : {}),
    };
}

export const AiMessageCommandWireSchema = aiWireSchema(AiMessageCommandSchema);
export const AiApprovalDecisionWireSchema = aiWireSchema(AiApprovalDecisionSchema);
export const AiStreamEventWireSchema = aiWireSchema(AiStreamEventSchema);
import { toSnakeStr } from "../../casing";
