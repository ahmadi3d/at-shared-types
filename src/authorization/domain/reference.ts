import type { AtJsonObject } from "../../core/domain/json.types";
import type { AtPermissionScopeType, AtTelecomUnitId, AtSecurityRevision } from "./authorization";

/** Structural match for existing enum/Cascade consumers. */
export interface AtReferenceItemDto<TMetadata extends AtJsonObject = AtJsonObject> {
    id: number | string;
    title: string;
    parentId?: number | string | null;
    metadata?: TMetadata;
}
export type AtSecurityCatalogMetadataDto = {
    kind: "system" | "section" | "permission" | "role";
    key: string;
    enabled: boolean;
    systemManaged: boolean;
    systemId?: number;
    sectionId?: number | null;
    scopeType?: AtPermissionScopeType;
};
export type AtSecurityCatalogItemDto = AtReferenceItemDto<AtSecurityCatalogMetadataDto>;

export interface AtSecurityCatalogReferencePageDto {
    items: AtSecurityCatalogItemDto[];
    totalCount: string;
    securityAuthorityId: string;
    securityGraphVersion: AtSecurityRevision;
}

export interface AtTelecomReferenceQueryDto {
    /** Tree children: absent/null parent means roots. Search may span parents. */
    parentId?: AtTelecomUnitId | null;
    searchText?: string;
    unitTypeKey?: string;
    pageNumber: number;
    /** 1..100; never a full-hierarchy preload. */
    pageSize: number;
}
export interface AtTelecomReferenceItemDto extends AtReferenceItemDto<{
    kind: "telecom-unit";
    unitTypeKey: string;
    statusKey: string;
    nameEn: string | null;
}> {
    id: AtTelecomUnitId;
    parentId: AtTelecomUnitId | null;
}
export interface AtTelecomReferencePageDto {
    items: AtTelecomReferenceItemDto[];
    pageNumber: number;
    pageSize: number;
    /** Decimal COUNT_BIG string; zero is returned even for an empty page. */
    totalCount: string;
}
