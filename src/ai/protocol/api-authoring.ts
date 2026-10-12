import type { AiJsonSchema } from "./platform-schemas";

const object = (properties: Record<string, AiJsonSchema>): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
});
const name: AiJsonSchema = { type: "string", pattern: "^[a-zA-Z][a-zA-Z0-9_]{0,99}$" };
const valueType: AiJsonSchema = { enum: ["string", "number", "integer", "boolean", "null"] };
export const AiApiResponseMappingsSchema: AiJsonSchema = {
    type: "array",
    maxItems: 32,
    items: object({
        name,
        sourcePointer: { type: "string", maxLength: 500 },
        type: valueType,
        required: { type: "boolean" },
    }),
};
export const AiApiSpecificationSchema: AiJsonSchema = object({
    schemaVersion: { const: 1 },
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", maxLength: 2000 },
    connectionProfileId: { type: "string", pattern: "^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$" },
    httpMethodId: { type: "integer", minimum: 1, maximum: 4 },
    endpointPath: { type: "string", minLength: 1, maxLength: 500 },
    parameters: {
        type: "array",
        maxItems: 16,
        items: object({
            name,
            example: { type: "string", maxLength: 1000 },
            description: { type: "string", maxLength: 200 },
        }),
    },
    bodyFields: {
        type: "array",
        maxItems: 32,
        items: object({
            name,
            type: valueType,
            example: {
                oneOf: [{ type: "string", maxLength: 1000 }, { type: "number" }, { type: "boolean" }, { type: "null" }],
            },
            required: { type: "boolean" },
        }),
    },
    responseMappings: AiApiResponseMappingsSchema,
    postScript: { oneOf: [{ type: "string", maxLength: 8000 }, { type: "null" }] },
});

export const AiApiEditorDraftSchema: AiJsonSchema = {
    ...object({
        postScript: AiApiSpecificationSchema.properties!.postScript,
        parameters: { oneOf: [AiApiSpecificationSchema.properties!.parameters, { type: "null" }] },
        bodyFields: { oneOf: [AiApiSpecificationSchema.properties!.bodyFields, { type: "null" }] },
        responseMappings: { oneOf: [AiApiResponseMappingsSchema, { type: "null" }] },
    }),
};
