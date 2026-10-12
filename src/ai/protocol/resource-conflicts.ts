import type { AiJsonSchema } from "./platform-schemas";
import { AiResourceReferenceSchema, AiVersionedPayloadSchema } from "./platform-schemas";

const id = {
    type: "string",
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$",
} as const;
const properties = {
    contractVersion: { const: 1 },
    approvalId: id,
    jobId: id,
    commandId: id,
    base: AiResourceReferenceSchema,
    current: AiResourceReferenceSchema,
    originalChange: AiVersionedPayloadSchema,
    currentChange: AiVersionedPayloadSchema,
};
const variant = (status: string, resolution: string): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: [...Object.keys(properties), "status", "resolution"],
    properties: { ...properties, status: { const: status }, resolution: { const: resolution } },
});
export const AiResourceConflictReviewSchema: AiJsonSchema = {
    oneOf: [variant("current", "none"), variant("conflict", "new_preview_required")],
};
