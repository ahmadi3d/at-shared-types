import {
    mapPartoSessionFromLogin,
    mapPartoSessionFromToken,
} from "./providers/parto/parto.runtime";

import {
    mapATPlatformSessionFromLogin,
    mapATPlatformSessionFromToken,
} from "./providers/atplatform/atplatform.runtime";

import { ATAuthProviderType, ATAuthSessionDTO } from "./domain/authSession";

export * from "./providers/parto/parto.runtime";
export * from "./providers/atplatform/atplatform.runtime";

const mapSessionFromLoginByProvider: Record<
    ATAuthProviderType,
    (response: any) => ATAuthSessionDTO
> = {
    atplatform: mapATPlatformSessionFromLogin,
    parto: mapPartoSessionFromLogin,
};

const mapSessionFromTokenByProvider: Record<
    ATAuthProviderType,
    (payload: any, token: string) => ATAuthSessionDTO
> = {
    atplatform: mapATPlatformSessionFromToken,
    parto: mapPartoSessionFromToken,
};

export function mapSessionFromLogin(
    providerType: ATAuthProviderType,
    response: unknown,
): ATAuthSessionDTO {
    const mapper = mapSessionFromLoginByProvider[providerType];

    if (!mapper)
        throw new Error(`Unsupported provider type: ${providerType}`);

    return mapper(response);
}

export function mapSessionFromToken(
    providerType: ATAuthProviderType,
    payload: unknown,
    token: string
): ATAuthSessionDTO {
    const mapper = mapSessionFromTokenByProvider[providerType];

    if (!mapper)
        throw new Error(`Unsupported provider type: ${providerType}`);

    return mapper(payload, token);
}

