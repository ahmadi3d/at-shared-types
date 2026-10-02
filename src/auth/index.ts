// Export core auth models & runtime functions
export * from "./domain/authSession";
export type * from "./domain/identity";
export * from "./auth.runtime";

import * as CoreTypes from "./domain/authSession";
import * as Runtime from "./auth.runtime";

// Exported namespace grouping all domain, session, and provider-specific types
export namespace Types {
    // Core session types
    export type AtAuthProviderType = CoreTypes.AtAuthProviderType;
    export type AtAuthUserDto = CoreTypes.AtAuthUserDto;
    export type AtAuthSessionDto = CoreTypes.AtAuthSessionDto;

    export type AtIdentityPrincipalDto = import("./domain/identity").AtIdentityPrincipalDto;
    export type AtIdentityTokenClaimsDto = import("./domain/identity").AtIdentityTokenClaimsDto;
    export type AtExternalIdentityReferenceDto = import("./domain/identity").AtExternalIdentityReferenceDto;
    export type AtSessionSummaryDto = import("./domain/identity").AtSessionSummaryDto;

    // AtPlatform Types
    export type AtPlatformLoginResponseDto = import("./providers/atplatform/atplatform.login.types").AtPlatformLoginResponseDto;
    export type AtPlatformAccessTokenPayloadDto = import("./providers/atplatform/atplatform.token.types").AtPlatformAccessTokenPayloadDto;

    // Parto Types
    export type PartoUserInfoDto = import("./providers/parto/parto.login.types").PartoUserInfoDto;
    export type PartoLoginResponseDto = import("./providers/parto/parto.login.types").PartoLoginResponseDto;
    export type PartoAccessTokenPayloadDto = import("./providers/parto/parto.token.types").PartoAccessTokenPayloadDto;

    // Host Types
    export type HostLoginResponseDto = import("./providers/host/host.login.types").HostLoginResponseDto;
    export type HostAccessTokenPayloadDto = import("./providers/host/host.token.types").HostAccessTokenPayloadDto;
}

// Export runtime under a clean namespace
export { Runtime };
