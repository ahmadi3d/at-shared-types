import type { AtJsonObject } from "../../core/domain/json.types";

export interface ApiConsumer {
    schemaVersion: 1;
    consumerId: string;
    name: string;
    enabled: boolean;
    /** Management-owned resource boundaries, evaluated by each source policy. */
    scope: AtJsonObject;
    revision: string;
    createdAt: string;
}

/** Safe management metadata; never contains a digest, raw secret or canonical BPMS identity. */
export interface ApiCredential {
    schemaVersion: 1;
    credentialId: string;
    name: string;
    consumerId: string;
    expiresAt: string;
    revokedAt: string | null;
    rotatedFrom: string | null;
    createdAt: string;
    lastUsedAt: string | null;
}

/** Returned once from issuance/rotation only; no read/list API reconstructs the secret. */
export interface ApiCredentialIssueResult {
    schemaVersion: 1;
    credential: ApiCredential;
    secret: string;
}

export interface ApiConsumerGrant {
    schemaVersion: 1;
    consumerId: string;
    endpointId: string;
    publicVersion: number;
    enabled: boolean;
}

export interface ApiConsumerWrite {
    schemaVersion: 1;
    name: string;
    enabled: boolean;
    scope: AtJsonObject;
    expectedRevision?: string;
}

export interface ApiCredentialIssueRequest {
    schemaVersion: 1;
    expectedRevision: string;
    name?: string;
    expiresAt?: string;
    overlapSeconds?: number;
}

export interface ApiConsumerGrantsWrite {
    schemaVersion: 1;
    expectedRevision: string;
    grants: Pick<ApiConsumerGrant, "endpointId" | "publicVersion" | "enabled">[];
}
