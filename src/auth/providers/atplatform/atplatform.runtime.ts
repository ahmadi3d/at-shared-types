import { AuthSessionDTO } from "../../domain/authSession";
import { ATPlatformLoginResponseDTO } from "./atplatform.login.types";
import { ATPlatformAccessTokenPayloadDTO } from "./atplatform.token.types";

export function mapATPlatformSessionFromLogin(
    response: ATPlatformLoginResponseDTO
): AuthSessionDTO {
    return {
        token: response.token,
        refreshToken: response.refresh_token,
        iss: "atplatform",
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
): AuthSessionDTO {
    return {
        token,
        expiresAt: payload.exp,
        iss: "atplatform",
        user: {
            userID: payload.sub
        }
    };
}
