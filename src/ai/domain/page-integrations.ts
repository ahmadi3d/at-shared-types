export interface AiSchemaReferenceDto {
    id: string;
    version: number;
    /** SHA-256 of the canonical JSON schema/owning exported structural manifest. */
    fingerprint: string;
}

export interface AiCapabilityReferenceDto {
    id: string;
    version: number;
}

/** Metadata only. Browsers register reversible UI callbacks; this descriptor grants no server authority. */
export interface AiForegroundActionDescriptorDto {
    id: string;
    version: number;
    mode: "assist";
    risk: "transient";
    undoable: true;
    input: AiSchemaReferenceDto;
    output: AiSchemaReferenceDto;
}

export interface AiPageIntegrationDto {
    contractVersion: 1;
    pageId: string;
    integrationVersion: number;
    resourceType: string;
    resourceSchemaVersion: number;
    /** Owning source provenance for explicit development reconciliation, not executable compatibility. */
    domainFingerprint: string;
    context: AiSchemaReferenceDto;
    tools: AiCapabilityReferenceDto[];
    foregroundActions: AiForegroundActionDescriptorDto[];
    knowledge: AiSchemaReferenceDto[];
    lifecycle: "active" | "deprecated";
    /** Reviewable repository-relative provenance, never executable module-loader paths. */
    owner: {
        frontend: string;
        backend: string;
        schema: string;
        fixtures: string[];
    };
}

export interface AiIntegrationManifestDto {
    contractVersion: 1;
    applicationId: string;
    fingerprint: string;
    pages: AiPageIntegrationDto[];
}

export type AiPageCompatibility =
    | {
          status: "supported";
          deprecated: boolean;
          diagnostics?: Array<{ code: "AI_PAGE_SOURCE_DRIFT" | "AI_PAGE_KNOWLEDGE_DRIFT"; repair: string }>;
      }
    | { status: "invalid" | "unsupported_version" | "schema_drift" | "action_removed"; code: string; repair: string };
