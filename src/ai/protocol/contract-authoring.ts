import type { AiJsonSchema } from "./platform-schemas";

const object = (properties: Record<string, AiJsonSchema>): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
});
export const AiContractShapeNodesSchema: AiJsonSchema = {
    type: "array",
    minItems: 1,
    maxItems: 64,
    items: object({
        path: { type: "string", maxLength: 500 },
        kind: { enum: ["unknown", "string", "number", "integer", "boolean", "object", "array"] },
        required: { type: "boolean" },
        nullable: { type: "boolean" },
        description: { type: "string", maxLength: 500 },
        format: { oneOf: [{ type: "string", minLength: 1, maxLength: 100 }, { type: "null" }] },
        enum: { type: "array", maxItems: 32, uniqueItems: true, items: { type: "string", maxLength: 200 } },
        additionalProperties: { type: "boolean" },
    }),
};
export const AiContractSpecificationSchema: AiJsonSchema = object({
    schemaVersion: { const: 1 },
    key: { type: "string", pattern: "^[a-zA-Z][a-zA-Z0-9._-]{0,199}$" },
    name: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", maxLength: 2000 },
    effect: { enum: ["read", "write"] },
    inputNodes: AiContractShapeNodesSchema,
    outputNodes: AiContractShapeNodesSchema,
    representativeInputJson: { oneOf: [{ type: "string", maxLength: 16000 }, { type: "null" }] },
    mockOutputJson: { oneOf: [{ type: "string", maxLength: 16000 }, { type: "null" }] },
});

export const AiContractEditorDraftSchema: AiJsonSchema = object({
    name: { oneOf: [AiContractSpecificationSchema.properties!.name, { type: "null" }] },
    description: { oneOf: [AiContractSpecificationSchema.properties!.description, { type: "null" }] },
    effect: { oneOf: [{ enum: ["read", "write"] }, { type: "null" }] },
    inputNodes: { oneOf: [AiContractShapeNodesSchema, { type: "null" }] },
    outputNodes: { oneOf: [AiContractShapeNodesSchema, { type: "null" }] },
    mockMode: { enum: ["unchanged", "remove", "replace"] },
    mockOutputJson: AiContractSpecificationSchema.properties!.mockOutputJson,
});

export const AiContractEditorPreviewSchema: AiJsonSchema = object({
    key: { type: "string", minLength: 1, maxLength: 200 },
    name: { type: "string", minLength: 1, maxLength: 200 },
    version: { type: "integer", minimum: 1, maximum: 2147483647 },
    status: { enum: ["draft", "published", "deprecated", "retired"] },
    effect: { enum: ["read", "write"] },
    inputNodeCount: { type: "integer", minimum: 0, maximum: 10000 },
    outputNodeCount: { type: "integer", minimum: 0, maximum: 10000 },
});
