import { ATAuthSessionDTO } from "../../domain/authSession";
import { ATPlatformLoginResponseDTO } from "./atplatform.login.types";
import { ATPlatformAccessTokenPayloadDTO } from "./atplatform.token.types";

export function mapATPlatformSessionFromLogin(
    response: ATPlatformLoginResponseDTO
): ATAuthSessionDTO {
    return {
        token: response.token,
        refreshToken: response.refresh_token,
        providerType: 'atplatform',
        user: {
            userID: String(response.user_id),
            username: response.username,
            firstName: response.first_name,
            lastName: response.last_name
        }
    };
}

export function mapATPlatformSessionFromToken(
    payload: ATPlatformAccessTokenPayloadDTO,
    token: string
): ATAuthSessionDTO {
    return {
        token,
        expiresAt: payload.exp,
        iss: payload.iss,
        providerType: 'atplatform',
        user: {
            userID: payload.sub
        }
    };
}
