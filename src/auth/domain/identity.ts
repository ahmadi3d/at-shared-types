/** Contract v3. Internal identity remains provider-independent. */
export interface AtIdentityPrincipalDto {
    userId: string;
    sessionId: string;
    securityAuthorityId: string;
}

/** Only these claims are issued by canonical AT access/refresh tokens. */
export interface AtIdentityTokenClaimsDto {
    sub: string;
    sid: string;
    authority: string;
    iss: string;
    aud: string;
    iat: number;
    exp: number;
    jti: string;
    tokenUse: "access" | "refresh";
}

export interface AtExternalIdentityReferenceDto {
    providerKey: string;
    issuer: string;
    subject: string;
}

export interface AtSessionSummaryDto {
    sessionId: string;
    issuedAt: string;
    expiresAt: string;
    revokedAt: string | null;
}
