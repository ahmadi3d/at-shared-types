import type { AtIdentityPrincipalDto } from "../../auth/domain/identity";
import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";

/** Selectable modes. An external identity extension does not enable another mode. */
export type PublicAuthenticationMode = "anonymous" | "apiKey" | "atPlatform";

/** The storage envelope permits a future registered strategy without new columns. */
export interface PublicAccessPolicyDescriptor {
    mode: string;
}

export type PublicEndpointAccessPolicy =
    | { mode: "anonymous"; explicitOptIn: true }
    | { mode: "apiKey" }
    | {
        mode: "atPlatform";
        /** Empty or unknown role sets deny. Membership never replaces resource checks. */
        permittedRoleKeys: readonly string[];
    };

/** Trusted adapter output; never deserialize a principal from public request input. */
export type PublicPrincipal =
    | { kind: "anonymous" }
    | { kind: "apiConsumer"; consumerId: string; credentialId: string }
    | { kind: "atPlatformUser"; identity: AtIdentityPrincipalDto }
    | {
        /** Extension seam only: no external token provider is registered today. */
        kind: "externalSubject";
        providerKey: string;
        issuer: string;
        subject: string;
        verifiedClaims: AtJsonObject;
    };

/** Ephemeral server-side transport projection. Never persist or log credentials. */
export interface PublicAuthenticationRequest {
    schemaVersion: 1;
    correlationId: string;
    credentials: {
        apiKey?: string;
        accessToken?: string;
    };
}

export interface PublicEndpointAuthenticationPort {
    authenticate(request: PublicAuthenticationRequest): Promise<PublicPrincipal>;
}

export interface PublicAuthorizationRequest<
    TPolicy extends PublicAccessPolicyDescriptor = PublicEndpointAccessPolicy
> {
    schemaVersion: 1;
    endpointId: string;
    publicVersion: number;
    releaseId: string;
    correlationId: string;
    policy: TPolicy;
    principal: PublicPrincipal;
    effect: "read" | "write";
    /** Resolved by trusted source policy; public input alone cannot establish scope. */
    resourceScope: AtJsonObject;
}

export interface PublicEndpointAuthorizationPort<
    TPolicy extends PublicAccessPolicyDescriptor = PublicEndpointAccessPolicy
> {
    /** Must check current enable state, grants, authority and resource policy or throw. */
    authorize(request: PublicAuthorizationRequest<TPolicy>): Promise<PublicAuthorizationDecision>;
}

export interface PublicAuthorizationDecision {
    schemaVersion: 1;
    /** Current verified caller scope; targets still enforce their own resource policy. */
    resourceScope: AtJsonObject;
}

/** Target adapters receive trusted application context, never HTTP/SQL objects. */
export interface PublicTargetExecutionRequest {
    schemaVersion: 1;
    correlationId: string;
    principal: PublicPrincipal;
    resourceScope: AtJsonObject;
    input: AtJsonValue;
}

export interface PublicTargetExecutionPort {
    execute(request: PublicTargetExecutionRequest): Promise<AtJsonValue>;
}
