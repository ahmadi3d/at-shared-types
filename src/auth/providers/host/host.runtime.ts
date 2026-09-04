import { AtAuthSessionDto } from "../../domain/authSession";
import { HostLoginResponseDto } from "./host.login.types";
import { HostAccessTokenPayloadDto } from "./host.token.types";

export function mapHostSessionFromLogin(
    response: HostLoginResponseDto
): AtAuthSessionDto {
    const user = response.userInfo;

    return {
        token: response.token,
        refreshToken: response.refreshToken,
        providerType: "host",
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

export function mapHostSessionFromToken(
    payload: HostAccessTokenPayloadDto,
    token: string
): AtAuthSessionDto {
    return {
        token,
        expiresAt: payload.exp,
        providerType: "host",
        iss: payload.iss,
        user: {
            userId: payload.ID,
            username: payload.unique_name,
            permissions: payload.PERMISSIONS?.split(",")
        }
    };
}
