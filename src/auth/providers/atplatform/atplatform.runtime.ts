import { AtAuthSessionDto } from "../../domain/authSession";
import { AtPlatformLoginResponseDto } from "./atplatform.login.types";
import { AtPlatformAccessTokenPayloadDto } from "./atplatform.token.types";

export function mapAtPlatformSessionFromLogin(
    response: AtPlatformLoginResponseDto
): AtAuthSessionDto {
    return {
        token: response.token,
        refreshToken: response.refresh_token,
        providerType: 'atplatform',
        user: {
            userId: String(response.user_id),
            username: response.username,
            firstName: response.first_name,
            lastName: response.last_name
        }
    };
}

export function mapAtPlatformSessionFromToken(
    payload: AtPlatformAccessTokenPayloadDto,
    token: string
): AtAuthSessionDto {
    return {
        token,
        expiresAt: payload.exp,
        iss: payload.iss,
        providerType: 'atplatform',
        user: {
            userId: payload.sub
        }
    };
}
