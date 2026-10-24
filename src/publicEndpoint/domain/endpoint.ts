import type { AtJsonValue } from "../../core/domain/json.types";
import type { DataShape } from "../../dataShape/domain";
import type { DataTransform } from "../../dataSource/domain";
import type { PublicEndpointAccessPolicy } from "./access";

export type PublicHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Source references are never external paths. Every reference pins an exact version. */
export type PublicEndpointSource =
    | { kind: "dataContract"; identity: string; version: number }
    | { kind: "apiIntegration"; identity: string; version: number }
    | { kind: "approvedRoute"; identity: string; version: number };

export interface PublicFieldMapping {
    publicPath: string;
    sourcePath: string;
}

export interface PublicEndpointLimits {
    requestsPerMinute: number;
    maxConcurrent: number;
    timeoutMs: number;
    maxRequestBytes: number;
    maxResponseBytes: number;
}

export interface PublicEndpointDraft {
    schemaVersion: 1;
    source: PublicEndpointSource;
    method: PublicHttpMethod;
    effect: "read" | "write";
    access: PublicEndpointAccessPolicy;
    inputShape: DataShape;
    outputShape: DataShape;
    /** Empty lists select schema-validated identity mapping. */
    inputMappings: PublicFieldMapping[];
    outputMappings: PublicFieldMapping[];
    /** GET arrays use repeated keys; null/object query encodings are not implicit. */
    querySerialization: "repeat";
    limits: PublicEndpointLimits;
    responseTransform: {
        enabled: boolean;
        /** Saved while disabled; only deliberately enabled transforms may execute. */
        definition: DataTransform;
    };
}

export interface PublicEndpointReleaseSnapshot extends PublicEndpointDraft {
    /** Server-derived exact implementation/publication fingerprint, never a latest selector. */
    sourceStamp: string;
}

export interface PublicEndpointDefinition {
    schemaVersion: 1;
    endpointId: string;
    slug: string;
    name: string;
    description: string | null;
    /** Decimal string, preserving SQL BIGINT equality without number coercion. */
    revision: string;
    draft: PublicEndpointDraft;
    createdAt: string;
    updatedAt: string;
}

/** Lightweight publication state for paged management catalogs and grant selection. */
export interface PublicEndpointCatalogEntry extends PublicEndpointDefinition {
    versions: {
        publicVersion: number;
        enabled: boolean;
        accessMode: PublicEndpointAccessPolicy["mode"];
    }[];
}

export interface PublicEndpointRelease {
    schemaVersion: 1;
    releaseId: string;
    endpointId: string;
    releaseNumber: number;
    snapshot: PublicEndpointReleaseSnapshot;
    publishedAt: string;
    publishedBy: string;
}

export interface PublicEndpointVersion {
    schemaVersion: 1;
    endpointId: string;
    publicVersion: number;
    releaseId: string;
    enabled: boolean;
    revision: string;
    updatedAt: string;
}

export interface PublicEndpointResolution {
    schemaVersion: 1;
    endpointId: string;
    slug: string;
    version: PublicEndpointVersion;
    release: PublicEndpointRelease;
}

/** Public failures deliberately exclude source identities, diagnostics and credential fields. */
export type PublicEndpointErrorCode =
    | "PUBLIC_ENDPOINT_NOT_FOUND"
    | "PUBLIC_ENDPOINT_DISABLED"
    | "PUBLIC_ENDPOINT_METHOD_NOT_ALLOWED"
    | "PUBLIC_ENDPOINT_AUTHENTICATION_REQUIRED"
    | "PUBLIC_ENDPOINT_FORBIDDEN"
    | "PUBLIC_ENDPOINT_RATE_LIMITED"
    | "PUBLIC_ENDPOINT_REQUEST_INVALID"
    | "PUBLIC_ENDPOINT_RESPONSE_INVALID"
    | "PUBLIC_ENDPOINT_TIMEOUT"
    | "PUBLIC_ENDPOINT_UNAVAILABLE";

export interface PublicEndpointFailure {
    schemaVersion: 1;
    code: PublicEndpointErrorCode;
    message: string;
    correlationId: string;
}

export interface PublicEndpointTestResult {
    schemaVersion: 1;
    status: number;
    durationMs: number;
    response: AtJsonValue;
}
