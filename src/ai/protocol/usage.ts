import type { AiJsonSchema } from "./platform-schemas";

const decimal = { type: "string", pattern: "^(0|[1-9][0-9]{0,18})$" };
const optionalDecimal: AiJsonSchema = { oneOf: [decimal, { type: "null" }] };
export const AiSelfUsageSchema: AiJsonSchema = {
    type: "object",
    additionalProperties: false,
    required: ["contractVersion", "individualAllowance", "total", "records"],
    properties: {
        contractVersion: { const: 1 },
        individualAllowance: { enum: ["exempt", "enforced"] },
        total: optionalDecimal,
        records: {
            type: "array",
            maxItems: 10,
            items: {
                type: "object",
                additionalProperties: false,
                required: [
                    "id",
                    "state",
                    "estimatedMicroUsd",
                    "actualMicroUsd",
                    "inputTokens",
                    "outputTokens",
                    "createdAt",
                ],
                properties: {
                    id: {
                        type: "string",
                        pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
                    },
                    state: { enum: ["reserved", "in_flight", "settled", "released", "ambiguous"] },
                    estimatedMicroUsd: optionalDecimal,
                    actualMicroUsd: optionalDecimal,
                    inputTokens: optionalDecimal,
                    outputTokens: optionalDecimal,
                    createdAt: { type: "string", minLength: 20, maxLength: 40 },
                },
            },
        },
    },
};
