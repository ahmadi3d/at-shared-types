const decimal = { type: "string", pattern: "^[1-9][0-9]{0,18}$" };
const reference = { type: "integer", minimum: 1, maximum: 32767 };
const smallReference = { type: "integer", minimum: 1, maximum: 255 };
const text = (maxLength: number) => ({ type: "string", maxLength });
const object = (properties: Record<string, unknown>, required = Object.keys(properties)) => ({
    type: "object",
    additionalProperties: false,
    properties,
    required,
});
const nullable = (schema: Record<string, unknown>) => ({ anyOf: [schema, { type: "null" }] });
const timestamp = {
    type: "string",
    pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{3})?Z$",
};

export const SupportAttachmentSchema = object(
    {
        archiveId: { type: "string", minLength: 1, maxLength: 256, pattern: "^[^\\u0000-\\u0020\\u007f]+$" },
        fileName: { type: "string", minLength: 1, maxLength: 255, pattern: "^[^\\u0000-\\u001f\\\\/]+$" },
        mimeType: { type: "string", maxLength: 150 },
        size: { type: "integer", minimum: 0, maximum: 10485760 },
    },
    ["archiveId", "fileName"]
);
const attachments = { type: "array", maxItems: 10, items: SupportAttachmentSchema, uniqueItems: true };

export const SupportPageContextSchema = object(
    {
        version: { const: 1 },
        path: { type: "string", minLength: 1, maxLength: 2048, pattern: "^/[^?#\\u0000-\\u001f]*$" },
        title: text(300),
        language: text(30),
        appVersion: text(100),
        viewport: object({
            width: { type: "integer", minimum: 1, maximum: 10000 },
            height: { type: "integer", minimum: 1, maximum: 10000 },
        }),
    },
    ["version", "path"]
);

export const SupportCreateTicketSchema = object(
    {
        projectId: reference,
        subProjectId: reference,
        categoryId: reference,
        priorityId: reference,
        departmentId: reference,
        subject: { type: "string", minLength: 1, maxLength: 255, pattern: "\\S" },
        body: text(20000),
        attachments,
        parentId: decimal,
        context: SupportPageContextSchema,
    },
    ["projectId", "subProjectId", "categoryId", "priorityId", "departmentId", "subject"]
);

export const SupportReplySchema = object(
    {
        body: text(20000),
        attachments,
        internal: { type: "boolean" },
        toDepartmentId: nullable(reference),
        toUserId: nullable(decimal),
    },
    []
);

const actionVariants = [
    object(
        {
            action: { const: "assign" },
            departmentId: nullable(reference),
            userId: nullable(decimal),
            estimatedDuration: nullable({ type: "integer", minimum: 1, maximum: 1000000 }),
            dueAt: nullable(timestamp),
            serviceTimeId: nullable(smallReference),
            description: text(20000),
        },
        ["action"]
    ),
    object({
        action: { enum: ["requestClose", "reject"] },
        description: { type: "string", minLength: 1, maxLength: 20000, pattern: "\\S" },
    }),
    object({ action: { const: "close" }, resolveTypeId: reference }),
    object({ action: { const: "cancel" }, cancelReasonId: smallReference }),
];

export const SupportTicketActionSchema = { oneOf: actionVariants };
export const SupportBatchActionSchema = {
    oneOf: actionVariants.map((variant) =>
        object(
            {
                ...variant.properties,
                ticketIds: { type: "array", minItems: 1, maxItems: 50, uniqueItems: true, items: decimal },
            },
            [...variant.required, "ticketIds"]
        )
    ),
};
