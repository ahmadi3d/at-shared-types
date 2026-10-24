import type {
    AtIdentityPrincipalDto,
    PublicAuthenticationMode,
    PublicEndpointAccessPolicy,
    PublicEndpointAuthenticationPort,
    PublicEndpointAuthorizationPort,
    PublicEndpointDefinition,
    PublicEndpointSource,
    ApiCredential,
    PublicPrincipal,
    PublicTargetExecutionPort,
} from "../src/domain";

const keyPolicy: PublicEndpointAccessPolicy = { mode: "apiKey" };
const anonymous: PublicEndpointAccessPolicy = { mode: "anonymous", explicitOptIn: true };
const platform: PublicEndpointAccessPolicy = { mode: "atPlatform", permittedRoleKeys: ["api-operator"] };
// @ts-expect-error Anonymous publication requires a deliberate opt-in.
const implicitAnonymous: PublicEndpointAccessPolicy = { mode: "anonymous" };
// @ts-expect-error Platform authentication alone does not confer endpoint authorization.
const unrestrictedPlatform: PublicEndpointAccessPolicy = { mode: "atPlatform" };
// @ts-expect-error OAuth is not a working/selectable authentication mode.
const oauthMode: PublicAuthenticationMode = "oauth";

const consumer: PublicPrincipal = { kind: "apiConsumer", consumerId: "consumer", credentialId: "credential" };
// @ts-expect-error A consumer cannot be used as a canonical BPMS management principal.
const managementPrincipal: AtIdentityPrincipalDto = consumer;
// @ts-expect-error Platform principals must contain verified canonical session/authority identity.
const untrustedPlatform: PublicPrincipal = { kind: "atPlatformUser", userId: "1" };

const revision: PublicEndpointDefinition["revision"] = "9007199254740993";
// @ts-expect-error SQL BIGINT equality tokens must not lose precision through JS numbers.
const numericRevision: PublicEndpointDefinition["revision"] = 9007199254740993;
const exactSource: PublicEndpointSource = { kind: "dataContract", identity: "opaque-server-uuid", version: 1 };
// @ts-expect-error Public targets never silently follow the latest publication.
const driftingSource: PublicEndpointSource = { kind: "apiIntegration", identity: "opaque-server-uuid", version: "latestPublished" };
// @ts-expect-error Management metadata never contains the credential verifier.
const verifierField: keyof ApiCredential = "digest";

// Compile-only fake provider proves the extension boundary; no OAuth runtime is added.
const futureProvider: PublicEndpointAuthenticationPort = {
    async authenticate() {
        return {
            kind: "externalSubject",
            providerKey: "fixture-provider",
            issuer: "https://issuer.invalid",
            subject: "fixture-subject",
            verifiedClaims: { audience: "fixture-api", scopes: ["read"] },
        };
    },
};

type FuturePolicy = { mode: "fixture-federation"; audience: string };

async function useFutureAdapter(
    authorization: PublicEndpointAuthorizationPort<FuturePolicy>,
    target: PublicTargetExecutionPort,
) {
    const principal = await futureProvider.authenticate({
        schemaVersion: 1,
        correlationId: "fixture-request",
        credentials: { accessToken: "fixture-only" },
    });
    const decision = await authorization.authorize({
        schemaVersion: 1,
        endpointId: "fixture-endpoint",
        publicVersion: 1,
        releaseId: "fixture-release",
        correlationId: "fixture-request",
        principal,
        policy: { mode: "fixture-federation", audience: "fixture-api" },
        effect: "read",
        resourceScope: {},
    });
    return target.execute({
        schemaVersion: 1,
        correlationId: "fixture-request",
        principal,
        resourceScope: decision.resourceScope,
        input: {},
    });
}

void [keyPolicy, anonymous, platform, implicitAnonymous, unrestrictedPlatform,
    oauthMode, managementPrincipal, untrustedPlatform, revision, numericRevision,
    exactSource, driftingSource, verifierField, useFutureAdapter];
