// Export core auth models & runtime functions
export * from "./domain/authSession";
export * from "./auth.runtime";

import * as CoreTypes from "./domain/authSession";
import * as Runtime from "./auth.runtime";

// Exported namespace grouping all domain, session, and provider-specific types
export namespace Types {
    // Core session types
    export type AtAuthProviderType = CoreTypes.AtAuthProviderType;
    export type AtAuthUserDto = CoreTypes.AtAuthUserDto;
    export type AtAuthSessionDto = CoreTypes.AtAuthSessionDto;

    // AtPlatform Types
    export type AtPlatformLoginResponseDto = import("./providers/atplatform/atplatform.login.types").AtPlatformLoginResponseDto;
    export type AtPlatformAccessTokenPayloadDto = import("./providers/atplatform/atplatform.token.types").AtPlatformAccessTokenPayloadDto;

    // Parto Types
    export type PartoUserInfoDto = import("./providers/parto/parto.login.types").PartoUserInfoDto;
    export type PartoLoginResponseDto = import("./providers/parto/parto.login.types").PartoLoginResponseDto;
    export type PartoAccessTokenPayloadDto = import("./providers/parto/parto.token.types").PartoAccessTokenPayloadDto;
}

// Export runtime under a clean namespace
export { Runtime };
