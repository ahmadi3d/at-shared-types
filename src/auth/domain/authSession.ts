export const AtAuthProviderTypes = ["parto", "atplatform", "host"] as const;
export type AtAuthProviderType = typeof AtAuthProviderTypes[number];

export interface AtAuthUserDto {
    userId: string;

    username?: string;

    email?: string;

    firstName?: string;

    lastName?: string;

    avatar?: string;

}

export interface AtAuthSessionDto {
    /** Canonical internal session ID when issued by AT. */
    sessionId?: string;

    token: string;

    refreshToken?: string;

    expiresAt?: number;

    iss?: string;

    providerType: AtAuthProviderType;

    user: AtAuthUserDto;

    //issuer junks 
    meta?: Record<string, unknown>;
}
