import type { AiIntegrationManifestDto, AiPageCompatibility, AiPageIntegrationDto } from "../domain/page-integrations";
import type { AiJsonSchema } from "./platform-schemas";
import { validateAiProtocol } from "./platform-validation";
import type { AiPayloadRegistry } from "./platform-validation";

const key: AiJsonSchema = { type: "string", pattern: "^[a-z][a-z0-9._-]{0,149}$" };
const positive: AiJsonSchema = { type: "integer", minimum: 1, maximum: 2147483647 };
const fingerprint: AiJsonSchema = { type: "string", pattern: "^[0-9a-f]{64}$" };
const sourcePath: AiJsonSchema = {
    type: "string",
    minLength: 1,
    maxLength: 400,
    pattern: "^(?!.*(?:^|/)\\.\\.(?:/|$))(?!/)[a-zA-Z0-9._/-]+$",
};
const object = (properties: Record<string, AiJsonSchema>): AiJsonSchema => ({
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
});
const array = (items: AiJsonSchema, maximum: number): AiJsonSchema => ({
    type: "array",
    items,
    maxItems: maximum,
    uniqueItems: true,
});

export const AiSchemaReferenceSchema = object({ id: key, version: positive, fingerprint });
export const AiCapabilityReferenceSchema = object({ id: key, version: positive });
export const AiForegroundActionDescriptorSchema = object({
    id: key,
    version: positive,
    mode: { const: "assist" },
    risk: { const: "transient" },
    undoable: { const: true },
    input: AiSchemaReferenceSchema,
    output: AiSchemaReferenceSchema,
});
export const AiPageIntegrationSchema = object({
    contractVersion: { const: 1 },
    pageId: key,
    integrationVersion: positive,
    resourceType: key,
    resourceSchemaVersion: positive,
    domainFingerprint: fingerprint,
    context: AiSchemaReferenceSchema,
    tools: array(AiCapabilityReferenceSchema, 32),
    foregroundActions: array(AiForegroundActionDescriptorSchema, 32),
    knowledge: array(AiSchemaReferenceSchema, 32),
    lifecycle: { enum: ["active", "deprecated"] },
    owner: object({
        frontend: sourcePath,
        backend: sourcePath,
        schema: sourcePath,
        fixtures: { ...array(sourcePath, 16), minItems: 1 },
    }),
});
export const AiIntegrationManifestSchema = object({
    contractVersion: { const: 1 },
    applicationId: key,
    fingerprint,
    pages: { ...array(AiPageIntegrationSchema, 32), minItems: 1 },
});

/** Stable JSON for native browser/Node SHA-256. Accessors, cycles and oversized data fail before traversal. */
export function canonicalAiJson(source: unknown, registry?: AiPayloadRegistry): string {
    if (validateAiProtocol({ type: "object", additionalProperties: true }, source, registry).status !== "valid")
        throw new Error("AI_MANIFEST_JSON_INVALID");
    const canonical = (value: unknown): unknown => {
        if (Array.isArray(value)) return value.map(canonical);
        if (value && typeof value === "object")
            return Object.fromEntries(
                Object.keys(value)
                    .sort()
                    .map((name) => [name, canonical((value as Record<string, unknown>)[name])]),
            );
        return value;
    };
    return JSON.stringify(canonical(source));
}

export function validateAiPageIntegration(source: unknown): AiPageIntegrationDto | null {
    const checked = validateAiProtocol<AiPageIntegrationDto>(AiPageIntegrationSchema, source);
    if (checked.status !== "valid") return null;
    const page = checked.value;
    for (const items of [page.tools, page.foregroundActions, page.knowledge]) {
        if (new Set(items.map((item) => item.id)).size !== items.length) return null;
    }
    return page;
}

/**
 * Persist executable contracts independently of source/knowledge provenance.
 * `legacy` reproduces the former payload only to verify an exact, trusted descriptor's old fingerprint.
 */
export function canonicalAiPageContract(source: unknown, format: "executable" | "legacy" = "executable"): string {
    const page = validateAiPageIntegration(source);
    if (!page) throw new Error("AI_PAGE_DESCRIPTOR_INVALID");
    const { owner: _owner, lifecycle: _lifecycle, domainFingerprint, knowledge, ...contract } = page;
    const sorted = <T extends { id: string }>(items: T[]) =>
        [...items].sort((left, right) => left.id.localeCompare(right.id));
    return canonicalAiJson({
        ...contract,
        tools: sorted(page.tools),
        foregroundActions: sorted(page.foregroundActions),
        ...(format === "legacy" ? { domainFingerprint, knowledge: sorted(knowledge) } : {}),
    });
}

export function validateAiIntegrationManifest(source: unknown): AiIntegrationManifestDto | null {
    const result = validateAiProtocol<AiIntegrationManifestDto>(AiIntegrationManifestSchema, source);
    if (result.status !== "valid") return null;
    const versions = result.value.pages.map((page) => page.pageId + "/" + page.integrationVersion);
    if (
        new Set(versions).size !== versions.length ||
        result.value.pages.some((page) => !validateAiPageIntegration(page))
    )
        return null;
    return result.value;
}

/** Executable contracts are strict; source and knowledge provenance remain reviewable diagnostics. */
export function compareAiPageIntegration(local: unknown, remote: unknown): AiPageCompatibility {
    const client = validateAiPageIntegration(local),
        server = validateAiPageIntegration(remote);
    if (!client || !server)
        return {
            status: "invalid",
            code: "AI_PAGE_DESCRIPTOR_INVALID",
            repair: "Use closed typed metadata with unique action/tool/source IDs and relative owner paths.",
        };
    if (
        client.pageId !== server.pageId ||
        client.resourceType !== server.resourceType ||
        client.integrationVersion !== server.integrationVersion
    )
        return {
            status: "unsupported_version",
            code: "AI_PAGE_INTEGRATION_UNSUPPORTED",
            repair: "Register the matching owning page version or an explicit supported migration.",
        };
    if (
        client.resourceSchemaVersion !== server.resourceSchemaVersion ||
        canonicalAiJson(client.context) !== canonicalAiJson(server.context)
    )
        return {
            status: "schema_drift",
            code: "AI_PAGE_SCHEMA_DRIFT",
            repair: "Update the owning context/schema adapter, version, canonical manifest and compatibility fixtures.",
        };
    const capabilities = (page: AiPageIntegrationDto) => ({
        tools: [...page.tools].sort((a, b) => a.id.localeCompare(b.id)),
        foregroundActions: [...page.foregroundActions].sort((a, b) => a.id.localeCompare(b.id)),
    });
    if (canonicalAiJson(capabilities(client)) !== canonicalAiJson(capabilities(server)))
        return {
            status: "action_removed",
            code: "AI_PAGE_CAPABILITY_DRIFT",
            repair: "Reconcile added, changed or retired tool/foreground actions in their owning adapters and fixtures.",
        };
    const diagnostics: NonNullable<Extract<AiPageCompatibility, { status: "supported" }>["diagnostics"]> = [];
    if (client.domainFingerprint !== server.domainFingerprint)
        diagnostics.push({
            code: "AI_PAGE_SOURCE_DRIFT",
            repair: `Review ${client.pageId} owning sources (${client.owner.frontend}, ${client.owner.schema}; ` +
                `server ${server.owner.backend}) and explicitly reconcile manifests. ` +
                "Native writes still require current native validation.",
        });
    if (
        canonicalAiJson({ sources: [...client.knowledge].sort((a, b) => a.id.localeCompare(b.id)) }) !==
        canonicalAiJson({ sources: [...server.knowledge].sort((a, b) => a.id.localeCompare(b.id)) })
    )
        diagnostics.push({
            code: "AI_PAGE_KNOWLEDGE_DRIFT",
            repair: `Review ${client.pageId} knowledge source versions and provenance in ${server.owner.backend}; ` +
                "explicitly reconcile after review.",
        });
    return {
        status: "supported",
        deprecated: server.lifecycle === "deprecated",
        ...(diagnostics.length ? { diagnostics } : {}),
    };
}
