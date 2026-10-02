/** Decimal strings preserve SQL BIGINT exactly, including beyond JS safe integers. */
export type AtTelecomUnitId = string;
export type AtSecurityRevision = string;
export type AtPermissionKey = `${string}.${string}.${string}`;
export type AtPermissionScopeType = "NONE" | "TELECOM_UNIT";
export type AtPermissionOverrideEffect = "ALLOW" | "DENY";
export type AtPermissionOverrideState = "INHERIT" | AtPermissionOverrideEffect;

export interface AtRegionalRootDto {
    telecomUnitId: AtTelecomUnitId;
    includeDescendants: boolean;
}
export interface AtSecurityVersionDto {
    securityAuthorityId: string;
    securityGraphVersion: AtSecurityRevision;
    authorizationVersion: AtSecurityRevision;
}
export interface AtPermissionDto {
    id: number;
    key: AtPermissionKey;
    scopeType: AtPermissionScopeType;
}
/** Frontend UX snapshot only. Backend requests establish current authority independently. */
export interface AtAuthorizationMeDto extends AtSecurityVersionDto {
    contractVersion: 3;
    userId: string;
    /** Opaque authority/user/graph equality tag. Not a token. */
    version: string;
    permissions: AtPermissionDto[];
    regionalScopes: AtRegionalRootDto[];
}
export interface AtAuthorizationAssignmentSetDto {
    expectedAuthorizationVersion: AtSecurityRevision;
    /** Omitted sets stay unchanged; an empty array clears that set. */
    roleIds?: number[];
    permissionOverrides?: Array<{
        permissionId: number;
        effect: AtPermissionOverrideEffect
    }>;
    regionalRoots?: AtRegionalRootDto[];
}
export interface AtPermissionExplanationDto extends AtPermissionDto {
    effective: boolean;
    directOverride: AtPermissionOverrideState;
    roleSources: Array<{
        id: number;
        key: string;
        title: string;
        enabled: boolean
    }>;
    disabledReasons: Array<"user" | "role" | "permission" | "system" | "section">;
}
export interface AtUserEffectiveExplanationDto extends AtSecurityVersionDto {
    userId: string;
    permissions: AtPermissionExplanationDto[];
    regionalScopes: AtRegionalRootDto[];
    pageNumber: number;
    pageSize: number;
    totalCount: string;
}
/** 401 identity/session failure; 403 capability/resource failure; 409 stale mutation. */
export type AtSecurityErrorDto =
    | {
        status: 401;
        code: "AUTHENTICATION_REQUIRED" | "SESSION_INVALID" | "USER_DISABLED"
    }
    | {
        status: 403;
        code: "PERMISSION_REQUIRED" | "REGIONAL_SCOPE_REQUIRED" | "EXECUTION_CONTEXT_DENIED"
    }
    | {
        status: 409;
        code: "SECURITY_REVISION_CONFLICT" | "RESOURCE_REVISION_CONFLICT"
    };
