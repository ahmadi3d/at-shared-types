export interface PartoAccessTokenPayloadDto {
    aud: string;

    iss: string;

    sub?: string;

    ID: string;

    CUSTOMERID?: string;

    PERMISSIONS?: string;

    unique_name?: string;

    exp: number;

    iat: number;

    nbf?: number;
}
