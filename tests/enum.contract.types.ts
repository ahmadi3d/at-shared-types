import type { AtDomainDto, DataSourceValue, EnumDefinition, TabularColumnDefinition } from "../src/domain";

export const telecomSource = {
    type: "enum",
    config: { enumKey: "telecomUnits" },
} satisfies DataSourceValue;

export const telecomDefinition = {
    enumKey: "telecomUnits",
    title: "Telecom units",
    deliveryMode: "SERVER_SIDE",
    kind: "HIERARCHICAL",
    accessMode: "PRIVATE",
    translationMode: "NONE",
    enabled: true,
    hierarchy: { maxDepth: 32, levels: [{ id: "level0", title: "Telecom unit" }] },
    capabilities: { search: true, resolveMany: true, leafSearch: true },
} satisfies EnumDefinition;

export const column = {
    key: "ownerTelecomUnitId",
    enumKey: telecomDefinition.enumKey,
} satisfies TabularColumnDefinition;

export const namespaceDefinition: AtDomainDto.EnumDefinition = telecomDefinition;

export const invalidSource = {
    type: "enum",
    // @ts-expect-error Persisted semantic keys use enumKey exclusively.
    config: { enumId: "telecomUnits" },
} satisfies DataSourceValue;

export const invalidColumn = {
    key: "ownerTelecomUnitId",
    // @ts-expect-error Tabular display uses the same semantic enumKey contract.
    enumId: "telecomUnits",
} satisfies TabularColumnDefinition;

// @ts-expect-error Delivery modes do not add a second persisted DataSource type.
export const invalidType: DataSourceValue["type"] = "serverSideEnum";
