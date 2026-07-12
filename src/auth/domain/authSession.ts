export const AtAuthProviderTypes = ["parto", "atplatform"] as const;
export type AtAuthProviderType = typeof AtAuthProviderTypes[number];

export interface AtAuthUserDto {
    userId: string;

    username?: string;

    email?: string;

    firstName?: string;

    lastName?: string;

    avatar?: string;

    permissions?: string[];
}

export interface AtAuthSessionDto {
    token: string;

    refreshToken?: string;

    expiresAt?: number;

    iss?: string;

    providerType: AtAuthProviderType;

    user: AtAuthUserDto;

    //issuer junks 
    meta?: Record<string, unknown>;
}
