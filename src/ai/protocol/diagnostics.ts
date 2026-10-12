import type { AiJsonSchema } from "./platform-schemas";
const codeSchema: AiJsonSchema = { type: "string", pattern: "^[A-Z][A-Z0-9_]{0,99}$" };
const idSchema: AiJsonSchema = { type: "string", pattern: "^[a-zA-Z0-9_-]{1,128}$" };
const closed = (properties: Record<string, AiJsonSchema>, required = Object.keys(properties)): AiJsonSchema => ({
    type: "object",
    properties,
    required,
    additionalProperties: false,
});

export const AiDiagnosticResultSchema = closed({
    contractVersion: { const: 1 },
    code: codeSchema,
    category: {
        enum: ["authentication", "authorization", "validation", "conflict", "admission", "reconciliation", "unknown"],
    },
    summary: { type: "string", minLength: 1, maxLength: 400 },
    findings: {
        type: "array",
        maxItems: 16,
        items: closed({
            certainty: { enum: ["confirmed", "reported", "hypothesis", "unknown"] },
            code: codeSchema,
            message: { type: "string", minLength: 1, maxLength: 600 },
            source: { type: "string", pattern: "^[a-z][a-z0-9._/-]{0,199}$" },
        }),
    },
    citations: {
        type: "array",
        maxItems: 2,
        items: closed({
            sourceId: { type: "string", pattern: "^[a-z][a-z0-9._-]{0,149}$" },
            version: { type: "integer", minimum: 1 },
            chunkId: { type: "string", pattern: "^chunk-[0-9]{1,2}$" },
            sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
            heading: { type: "string", minLength: 1, maxLength: 200 },
        }),
    },
    navigation: {
        type: "array",
        maxItems: 2,
        items: closed(
            {
                target: {
                    enum: [
                        "page",
                        "ai-job",
                        "workflow-operation",
                        "workflow-instance",
                        "workflow-task",
                        "workflow-publication",
                    ],
                },
                id: idSchema,
                resourceId: idSchema,
            },
            ["target", "id"],
        ),
    },
});
