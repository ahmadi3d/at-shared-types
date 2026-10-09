export type EnumDeliveryMode = "EAGER" | "SERVER_SIDE";
export type EnumKind = "FLAT" | "HIERARCHICAL";
export type EnumAccessMode = "PRIVATE" | "PUBLIC";
export type EnumTranslationMode = "AUTO" | "NONE";

export interface EnumHierarchyLevel {
    id: string;
    title: string;
    languageKey?: string;
}

/** Bounded hierarchy description for fixed Cascade layers, without enum values. */
export interface EnumHierarchyDescriptor {
    maxDepth: number;
    levels: EnumHierarchyLevel[];
}

export interface EnumCapabilities {
    search: boolean;
    resolveMany: boolean;
    leafSearch: boolean;
}

/** Runtime metadata. Approved database query/source details remain server-owned. */
export interface EnumDefinition {
    enumKey: string;
    title: string;
    deliveryMode: EnumDeliveryMode;
    kind: EnumKind;
    accessMode: EnumAccessMode;
    translationMode: EnumTranslationMode;
    enabled: boolean;
    hierarchy?: EnumHierarchyDescriptor;
    capabilities: EnumCapabilities;
}
