export interface AuthUserDTO {
    userID: string;

    username?: string;

    email?: string;

    firstName?: string;

    lastName?: string;

    avatar?: string;

    permissions?: string[];
}

export interface AuthSessionDTO {
    token: string;

    refreshToken?: string;

    expiresAt?: number;

    iss: "parto" | "atplatform";

    user: AuthUserDTO;

    //issuer junks 
    meta?: Record<string, unknown>;
}
