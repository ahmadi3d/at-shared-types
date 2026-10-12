import type { AiJsonSchema } from "./platform-schemas";

const object = (properties: Record<string, AiJsonSchema>): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
});
const name: AiJsonSchema = { type: "string", pattern: "^[a-z][a-zA-Z0-9]{0,99}$" };
const reference: AiJsonSchema = {
    oneOf: [{ type: "string", pattern: "^[a-zA-Z][a-zA-Z0-9._-]{0,149}$" }, { type: "null" }],
};

export const AiFormSpecificationSchema: AiJsonSchema = object({
    schemaVersion: { const: 1 },
    title: { type: "string", minLength: 1, maxLength: 200 },
    description: { type: "string", maxLength: 2000 },
    locale: { enum: ["en", "fa"] },
    sections: {
        type: "array",
        minItems: 1,
        maxItems: 8,
        items: object({
            name,
            label: { type: "string", maxLength: 200 },
            renderer: { enum: ["Card", "Box", "Section", "Paper"] },
            fields: {
                type: "array",
                minItems: 1,
                maxItems: 16,
                items: object({
                    name,
                    label: { type: "string", maxLength: 200 },
                    control: {
                        enum: [
                            "TextBox",
                            "IntegerTextBox",
                            "FloatTextBox",
                            "DatePicker",
                            "CheckBox",
                            "ComboBox",
                            "MultiComboBox",
                        ],
                    },
                    required: { type: "boolean" },
                    size: { type: "integer", minimum: 1, maximum: 12 },
                    enumKey: reference,
                    uiColumnKey: reference,
                    visibleWhen: { ...object({ fieldName: name }), type: ["object", "null"] },
                }),
            },
        }),
    },
});

const changes: AiJsonSchema = {
    type: "array",
    minItems: 1,
    maxItems: 16,
    items: object({
        fieldName: { type: "string", minLength: 1, maxLength: 100 },
        label: { type: "string", maxLength: 100 },
        required: { type: "boolean" },
    }),
};
export const AiFormEditorDraftSchema: AiJsonSchema = {
    ...object({
        changes: { oneOf: [changes, { type: "null" }] },
        append: { ...AiFormSpecificationSchema, type: ["object", "null"] },
    }),
    oneOf: [
        { properties: { append: { type: "null" } } },
        { properties: { changes: { type: "null" } } },
    ],
};
