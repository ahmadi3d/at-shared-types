import { AtAuthSessionDto } from "../../domain/authSession";
import { AtPlatformLoginResponseDto } from "./atplatform.login.types";
import { AtPlatformAccessTokenPayloadDto } from "./atplatform.token.types";

export function mapAtPlatformSessionFromLogin(
    response: AtPlatformLoginResponseDto
): AtAuthSessionDto {
    return {
        token: response.token,
        sessionId: response.session_id,
        refreshToken: response.refresh_token,
        providerType: 'atplatform',
        user: {
            userId: String(response.user_id),
            username: response.username,
            firstName: response.first_name,
            lastName: response.last_name,
        }
    };
}

export function mapAtPlatformSessionFromToken(
    payload: AtPlatformAccessTokenPayloadDto,
    token: string
): AtAuthSessionDto {
    return {
        token,
        sessionId: payload.sid,
        expiresAt: payload.exp,
        iss: payload.iss,
        providerType: 'atplatform',
        user: {
            userId: String(payload.sub ?? payload.user_id ?? ""),
            username: payload.username,
        }
    };
}
