// Closed JSON schemas shared by authoring validation and the backend registry.
// Unknown keys, executable snippets, missing contexts and unsupported versions fail validation.
const name = { type: "string", pattern: "^[A-Za-z_][A-Za-z0-9_]{0,127}$" };
const permissionKey = { type: "string", maxLength: 150, pattern: "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*){2,}$" };
const decimalId = { type: "string", pattern: "^[1-9][0-9]{0,18}$" };
const guid = {
    type: "string",
    pattern: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
};
const object = (properties: Record<string, unknown>, required: string[]) =>
    ({ type: "object", additionalProperties: false, properties, required });

export const AtPostActionValueSourceSchema = { oneOf: [
        object({ source: { const: "parameter" }, name }, ["source", "name"]),
        object({
            source: { const: "result" },
            recordset: { type: "integer", minimum: 0, maximum: 15 },
            column: name
        }, ["source", "recordset", "column"]),
        object({ source: { const: "trustedInvoker" }, field: { enum: ["userId", "correlationId"] } }, ["source", "field"]),
        object({
            source: { const: "constant" },
            value: { type: ["string", "number", "boolean", "null"], maxLength: 150 }
        }, ["source", "value"]),
    ] };
export const AtPostActionSchema = { oneOf: [
        object({ type: { const: "authorization.invalidateUser" }, userId: AtPostActionValueSourceSchema }, ["type", "userId"]),
        object({ type: { const: "authorization.invalidateRoleUsers" }, roleId: AtPostActionValueSourceSchema }, ["type", "roleId"]),
        object({ type: { const: "authorization.invalidateGraph" } }, ["type"]),
        object({
            type: { const: "referenceData.invalidate" },
            keys: {
                type: "array",
                minItems: 1,
                maxItems: 16,
                uniqueItems: true,
                items: { enum: ["securityUserId", "securityRoleId", "securityPermissionId", "securitySystemId", "securitySectionId", "telecomUnit"] }
            }
        }, ["type", "keys"]),
        object({
            type: { const: "dbCache.refresh" },
            keys: {
                type: "array",
                minItems: 1,
                maxItems: 9,
                uniqueItems: true,
                items: { enum: ["webRoutines", "metaColumns", "metaTables", "metaEnums", "uiColumns", "businesses", "systems", "languages", "languageTerms"] }
            }
        }, ["type", "keys"]),
        object({
            type: { const: "event.publish" },
            event: { enum: ["security.user.changed", "security.role.changed", "security.permission.changed", "security.regional.changed", "customer.owner.changed", "workflow.scope.changed"] },
            targetId: AtPostActionValueSourceSchema
        }, ["type", "event", "targetId"]),
    ] };
export const AtPostActionEnvelopeSchema = object({ version: { const: 1 },
    actions: { type: "array", maxItems: 32, items: AtPostActionSchema } }, ["version", "actions"]);
const referenceKeys = {
    type: "array",
    minItems: 1,
    maxItems: 16,
    uniqueItems: true,
    items: { enum: ["securityUserId", "securityRoleId", "securityPermissionId", "securitySystemId", "securitySectionId", "telecomUnit"] }
};
export const AtBoundPostActionSchema = {oneOf: [
        object({type: {const: "authorization.invalidateUser"}, userId: decimalId}, ["type", "userId"]),
        object({type: {const: "authorization.invalidateRoleUsers"}, roleId: decimalId}, ["type", "roleId"]),
        object({type: {const: "authorization.invalidateGraph"}}, ["type"]),
        object({type: {const: "referenceData.invalidate"}, keys: referenceKeys}, ["type", "keys"]),
        object({
            type: { const: "dbCache.refresh" },
            keys: {
                type: "array",
                minItems: 1,
                maxItems: 9,
                uniqueItems: true,
                items: { enum: ["webRoutines", "metaColumns", "metaTables", "metaEnums", "uiColumns", "businesses", "systems", "languages", "languageTerms"] }
            }
        }, ["type", "keys"]),
        object({
            type: { const: "event.publish" },
            event: { enum: ["security.user.changed", "security.role.changed", "security.permission.changed", "security.regional.changed", "customer.owner.changed", "workflow.scope.changed"] },
            targetId: { oneOf: [decimalId, guid] }
        }, ["type", "event", "targetId"]),
    ]};
export const AtPostActionDispatchSchema = object({
    version: { const: 1 },
    eventId: guid,
    correlationId: guid,
    occurredAt: {
        type: "string",
        pattern: "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{1,7})?Z$"
    },
    routineKey: { type: "string", minLength: 1, maxLength: 200 },
    action: AtBoundPostActionSchema
},
    ["version", "eventId", "correlationId", "occurredAt", "routineKey", "action"]);
export const AtRoutineScopePolicySchema = { oneOf: [
        object({ key: { const: "none" } }, ["key"]),
        object({ key: { const: "telecomUnit.parameter" }, telecomUnitParameter: name }, ["key", "telecomUnitParameter"]),
        object({ key: { const: "customer.byId" }, customerIdParameter: name }, ["key", "customerIdParameter"]),
        object({
            key: { const: "customer.ownerTransfer" },
            customerIdParameter: name,
            destinationUnitParameter: name
        }, ["key", "customerIdParameter", "destinationUnitParameter"]),
        object({ key: { const: "workflow.instance" }, instanceIdParameter: name }, ["key", "instanceIdParameter"]),
        object({ key: { const: "workflow.start" }, definitionIdParameter: name }, ["key", "definitionIdParameter"]),
        object({
            key: { const: "workflow.scopeTransfer" },
            instanceIdParameter: name,
            destinationUnitParameter: name
        }, ["key", "instanceIdParameter", "destinationUnitParameter"]),
    ] };
const metadata = object({
    version: { const: 1 },
    authorizationMode: { enum: ["permission", "authenticated"] },
    requiredPermissionKey: permissionKey,
    reviewedExceptionKey: { type: "string", pattern: "^[a-z][a-z0-9.-]{2,149}$" },
    scopePolicy: AtRoutineScopePolicySchema,
    allowedExecutionContexts: {
        type: "array",
        minItems: 1,
        maxItems: 2,
        uniqueItems: true,
        items: { enum: ["user", "workflow-system"] }
    },
    authoringVisibility: { enum: ["hidden", "discoverable"] },
    authoringReferencePermissionKey: permissionKey,
    postActions: AtPostActionEnvelopeSchema,
}, ["version", "authorizationMode", "scopePolicy", "allowedExecutionContexts", "authoringVisibility"]);
export const RegisteredRoutineSecurityMetadataSchema = {
    ...metadata,
    allOf: [
        {
            if: { properties: { authorizationMode: { const: "permission" } }, required: ["authorizationMode"] },
            then: { required: ["requiredPermissionKey"], not: { required: ["reviewedExceptionKey"] } },
            else: { required: ["reviewedExceptionKey"], not: { required: ["requiredPermissionKey"] } }
        },
        {
            if: {
                properties: { allowedExecutionContexts: { contains: { const: "workflow-system" } } },
                required: ["allowedExecutionContexts"]
            },
            then: {
                required: ["authoringReferencePermissionKey"],
                anyOf: [
                    { properties: { authorizationMode: { const: "permission" } } },
                    {
                        properties: {
                            authorizationMode: { const: "authenticated" },
                            reviewedExceptionKey: { const: "localization.reference.read" },
                        },
                        required: ["reviewedExceptionKey"]
                    },
                ],
            }
        },
    ]
};
export const AtAuthorizationMeSchema = object({
    contractVersion: { const: 3 },
    userId: decimalId,
    version: { type: "string", minLength: 1, maxLength: 200 },
    securityAuthorityId: guid,
    securityGraphVersion: decimalId,
    authorizationVersion: decimalId,
    permissions: {
        type: "array",
        items: object({
            id: { type: "integer", minimum: 1 },
            key: permissionKey,
            scopeType: { enum: ["NONE", "TELECOM_UNIT"] }
        }, ["id", "key", "scopeType"])
    },
    regionalScopes: {
        type: "array",
        items: object({ telecomUnitId: decimalId, includeDescendants: { type: "boolean" } }, ["telecomUnitId", "includeDescendants"])
    },
}, ["contractVersion", "userId", "version", "securityAuthorityId", "securityGraphVersion", "authorizationVersion", "permissions", "regionalScopes"]);
export const AtSecurityContractVersion = 3 as const;
