import { ATAuthSessionDTO } from "../../domain/authSession";
import { PartoLoginResponseDTO } from "./parto.login.types";
import { PartoAccessTokenPayloadDTO } from "./parto.token.types";

export function mapPartoSessionFromLogin(
    response: PartoLoginResponseDTO
): ATAuthSessionDTO {
    const user = response.userInfo;

    return {
        token: response.token,
        refreshToken: response.refreshToken,
        iss: "parto",
        user: {
            userID: String(user.ID),
            username: user.userName,
            firstName: user.firstName,
            lastName: user.lastName
        },
        meta: {
            department: user.department,
            companyName: user.companyName,
            businessTypeID: user.businessTypeID
        }
    };
}

export function mapPartoSessionFromToken(
    payload: PartoAccessTokenPayloadDTO,
    token: string
): ATAuthSessionDTO {
    return {
        token,
        expiresAt: payload.exp,
        iss: "parto",
        user: {
            userID: payload.ID,
            username: payload.unique_name,
            permissions: payload.PERMISSIONS?.split(",")
        }
    };
}
