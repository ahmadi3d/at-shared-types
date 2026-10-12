import type { AiJsonSchema } from "./platform-schemas";

const object = (properties: Record<string, AiJsonSchema>): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
});
const id = { type: "string", pattern: "^[A-Za-z][A-Za-z0-9_]{0,39}$" };
export const AiBpmnSpecificationSchema: AiJsonSchema = object({
    schemaVersion: { const: 1 },
    title: { type: "string", minLength: 1, maxLength: 150 },
    description: { type: "string", maxLength: 250 },
    metadataJson: { oneOf: [{ type: "string", maxLength: 4000 }, { type: "null" }] },
    steps: {
        type: "array",
        minItems: 2,
        maxItems: 40,
        items: object({
            id,
            name: { type: "string", maxLength: 200 },
            kind: { enum: ["start", "end", "user-task", "automation", "exclusive-gateway", "parallel-gateway"] },
            definitionJson: { oneOf: [{ type: "string", maxLength: 16000 }, { type: "null" }] },
            formVersionId: { oneOf: [{ type: "integer", minimum: 1, maximum: 2147483647 }, { type: "null" }] },
        }),
    },
    transitions: {
        type: "array",
        minItems: 1,
        maxItems: 80,
        items: object({
            id,
            sourceId: id,
            targetId: id,
            name: { type: "string", maxLength: 200 },
            condition: { oneOf: [{ type: "string", minLength: 1, maxLength: 4000 }, { type: "null" }] },
            defaultRoute: { type: "boolean" },
        }),
    },
});

/** Structural hints only. Script sources, form contents and saved XML remain with the owning modeler. */
export const AiBpmnEditorPreviewSchema: AiJsonSchema = object({
    contentScope: { const: "bounded-editor-structure; scripts and form contents excluded" },
    truncated: { type: "boolean" },
    steps: {
        type: "array",
        maxItems: 40,
        items: object({
            id: { type: "string", maxLength: 200 },
            type: { type: "string", maxLength: 100 },
            name: { type: "string", maxLength: 200 },
            formId: { oneOf: [{ type: "integer", minimum: 1, maximum: 2147483647 }, { type: "null" }] },
            configuredEligibility: { type: "boolean" },
        }),
    },
    transitions: {
        type: "array",
        maxItems: 80,
        items: object({
            id: { type: "string", maxLength: 200 },
            sourceId: { type: "string", maxLength: 200 },
            targetId: { type: "string", maxLength: 200 },
            hasCondition: { type: "boolean" },
            defaultRoute: { type: "boolean" },
        }),
    },
});
