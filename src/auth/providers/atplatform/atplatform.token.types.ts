export interface AtPlatformAccessTokenPayloadDto {
    // user id
    sub: string;
    // session id, useful for tracking session in multiple devices and logging them out.
    sid: string;
    // issuer, which backend is issuing this? 
    iss: string;
    // audience, this token who is it for ? we can later reject token used for one system used for another.
    aud: string;

    iat: number;
    exp: number;
}
