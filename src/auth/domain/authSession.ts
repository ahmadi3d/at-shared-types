export const ATAuthProviderTypes = ["parto", "atplatform"] as const;
export type ATAuthProviderType = typeof ATAuthProviderTypes[number];

export interface ATAuthUserDTO {
    userID: string;

    username?: string;

    email?: string;

    firstName?: string;

    lastName?: string;

    avatar?: string;

    permissions?: string[];
}

export interface ATAuthSessionDTO {
    token: string;

    refreshToken?: string;

    expiresAt?: number;

    iss?: string;

    providerType: ATAuthProviderType;

    user: ATAuthUserDTO;

    //issuer junks 
    meta?: Record<string, unknown>;
}
