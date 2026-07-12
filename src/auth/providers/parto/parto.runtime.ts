import { AtAuthSessionDto } from "../../domain/authSession";
import { PartoLoginResponseDto } from "./parto.login.types";
import { PartoAccessTokenPayloadDto } from "./parto.token.types";

export function mapPartoSessionFromLogin(
    response: PartoLoginResponseDto
): AtAuthSessionDto {
    const user = response.userInfo;

    return {
        token: response.token,
        refreshToken: response.refreshToken,
        providerType: 'parto',
        user: {
            userId: String(user.ID),
            username: user.userName,
            firstName: user.firstName,
            lastName: user.lastName
        },
        meta: {
            department: user.department,
            companyName: user.companyName,
            businessTypeId: user.businessTypeId
        }
    };
}

export function mapPartoSessionFromToken(
    payload: PartoAccessTokenPayloadDto,
    token: string
): AtAuthSessionDto {
    return {
        token,
        expiresAt: payload.exp,
        providerType: 'parto',
        iss: payload.iss,
        user: {
            userId: payload.ID,
            username: payload.unique_name,
            permissions: payload.PERMISSIONS?.split(",")
        }
    };
}
