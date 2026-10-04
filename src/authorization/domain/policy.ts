import type { AtPermissionKey } from "./authorization";
export type AtRoutineExecutionContext = "user" | "workflow-system" | "workflow-task";
export type AtWorkflowTaskHook = "load" | "proceed";
export interface AtWorkflowRoutinePolicyDto {
    effect: "read" | "write";
    /** Explicit admission only; a write can never be admitted to load. */
    taskHooks?: AtWorkflowTaskHook[];
}
export type AtScopePolicyKey = "none" | "telecomUnit.parameter" | "customer.byId" |
    "customer.ownerTransfer" | "workflow.instance" | "workflow.start" | "workflow.scopeTransfer";
/** Fixed bindings name validated input fields, never expressions/code. */
export type AtRoutineScopePolicyDto =
    | { key: "none" }
    | {
        key: "telecomUnit.parameter";
        telecomUnitParameter: string
    }
    | {
        key: "customer.byId";
        customerIdParameter: string
    }
    | {
        key: "customer.ownerTransfer";
        customerIdParameter: string;
        destinationUnitParameter: string
    }
    | {
        key: "workflow.instance";
        instanceIdParameter: string
    }
    | {
        key: "workflow.start";
        definitionIdParameter: string
    }
    | {
        key: "workflow.scopeTransfer";
        instanceIdParameter: string;
        destinationUnitParameter: string
    };
export type AtPostActionValueSourceDto =
    | {
        source: "parameter";
        name: string
    }
    | {
        source: "result";
        recordset: number;
        column: string
    }
    | {
        source: "trustedInvoker";
        field: "userId" | "correlationId"
    }
    | {
        source: "constant";
        value: string | number | boolean | null
    };
export type AtSecurityEventKey = "security.user.changed" | "security.role.changed" |
    "security.permission.changed" | "security.regional.changed" | "customer.owner.changed" | "workflow.scope.changed";
export type AtReferenceDataKey = "securityUserId" | "securityRoleId" | "securityPermissionId" |
    "securitySystemId" | "securitySectionId" | "telecomUnit";
export type AtPostActionDbCacheKey = "webRoutines" | "metaColumns" | "metaTables" | "metaEnums" |
    "uiColumns" | "businesses" | "systems" | "languages" | "languageTerms";
export type AtPostActionDto =
    | {
        type: "authorization.invalidateUser";
        userId: AtPostActionValueSourceDto
    }
    | {
        type: "authorization.invalidateRoleUsers";
        roleId: AtPostActionValueSourceDto
    }
    | { type: "authorization.invalidateGraph" }
    | {
        type: "referenceData.invalidate";
        keys: AtReferenceDataKey[]
    }
    | {
        type: "dbCache.refresh";
        keys: AtPostActionDbCacheKey[]
    }
    | {
        type: "event.publish";
        event: AtSecurityEventKey;
        targetId: AtPostActionValueSourceDto
    };
export interface AtPostActionEnvelopeDto {
    version: 1;
    actions: AtPostActionDto[]
}
/** Permission is mandatory by default. Authenticated-only exceptions are explicitly reviewed. */
export type RegisteredRoutineSecurityMetadata = {
    version: 1;
    scopePolicy: AtRoutineScopePolicyDto;
    allowedExecutionContexts: AtRoutineExecutionContext[];
    authoringVisibility: "hidden" | "discoverable";
    authoringReferencePermissionKey?: AtPermissionKey;
    workflowExecution?: AtWorkflowRoutinePolicyDto;
    postActions?: AtPostActionEnvelopeDto;
} & (
        | {
            authorizationMode: "permission";
            requiredPermissionKey: AtPermissionKey
        }
        | {
            authorizationMode: "authenticated";
            reviewedExceptionKey: string;
            requiredPermissionKey?: never
        }
    );
export type AtBoundPostActionDto =
    | {
        type: "authorization.invalidateUser";
        userId: string
    }
    | {
        type: "authorization.invalidateRoleUsers";
        roleId: string
    }
    | { type: "authorization.invalidateGraph" }
    | {
        type: "referenceData.invalidate";
        keys: AtReferenceDataKey[]
    }
    | {
        type: "dbCache.refresh";
        keys: AtPostActionDbCacheKey[]
    }
    | {
        type: "event.publish";
        event: AtSecurityEventKey;
        targetId: string
    };

/** Persistent dispatcher evidence; delivery happens after the mutation commits. */
export interface AtPostActionDispatchDto {
    version: 1;
    eventId: string;
    correlationId: string;
    occurredAt: string;
    routineKey: string;
    /** Safe scalar IDs resolved once before committing; no late request/result lookup. */
    action: AtBoundPostActionDto;
}
