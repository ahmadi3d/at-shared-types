import {
    mapPartoSessionFromLogin,
    mapPartoSessionFromToken,
} from "./providers/parto/parto.runtime";

import {
    mapAtPlatformSessionFromLogin,
    mapAtPlatformSessionFromToken,
} from "./providers/atplatform/atplatform.runtime";

import {
    mapHostSessionFromLogin,
    mapHostSessionFromToken,
} from "./providers/host/host.runtime";

import { AtAuthProviderType, AtAuthSessionDto } from "./domain/authSession";

export * from "./providers/parto/parto.runtime";
export * from "./providers/atplatform/atplatform.runtime";
export * from "./providers/host/host.runtime";

const mapSessionFromLoginByProvider: Record<
    AtAuthProviderType,
    (response: any) => AtAuthSessionDto
> = {
    atplatform: mapAtPlatformSessionFromLogin,
    parto: mapPartoSessionFromLogin,
    host: mapHostSessionFromLogin,
};

const mapSessionFromTokenByProvider: Record<
    AtAuthProviderType,
    (payload: any, token: string) => AtAuthSessionDto
> = {
    atplatform: mapAtPlatformSessionFromToken,
    parto: mapPartoSessionFromToken,
    host: mapHostSessionFromToken,
};

export function mapSessionFromLogin(
    providerType: AtAuthProviderType,
    response: unknown,
): AtAuthSessionDto {
    // Canonical AT sessions are identical after local or external exchange, regardless of UI adapter.
    if (response && typeof response === "object" && "session_id" in response && "user_id" in response)
        return mapAtPlatformSessionFromLogin(response as Parameters<typeof mapAtPlatformSessionFromLogin>[0]);
    const mapper = mapSessionFromLoginByProvider[providerType];

    if (!mapper)
        throw new Error(`Unsupported provider type: ${providerType}`);

    return mapper(response);
}

export function mapSessionFromToken(
    providerType: AtAuthProviderType,
    payload: unknown,
    token: string
): AtAuthSessionDto {
    const claims = payload as Record<string, unknown> | null;
    if (claims?.tokenUse === "access" && typeof claims.sub === "string" && typeof claims.sid === "string" &&
        typeof claims.iss === "string" && typeof claims.aud === "string" && typeof claims.iat === "number" && typeof claims.exp === "number")
        return mapAtPlatformSessionFromToken(claims as unknown as Parameters<typeof mapAtPlatformSessionFromToken>[0], token);
    const mapper = mapSessionFromTokenByProvider[providerType];

    if (!mapper)
        throw new Error(`Unsupported provider type: ${providerType}`);

    return mapper(payload, token);
}
