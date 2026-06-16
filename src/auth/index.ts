// Export core auth models & runtime functions
export * from "./domain/authSession";
export * from "./auth.runtime";

import * as CoreTypes from "./domain/authSession";
import * as Runtime from "./auth.runtime";

// Exported namespace grouping all domain, session, and provider-specific types
export namespace Types {
    // Core session types
    export type ATAuthProviderType = CoreTypes.ATAuthProviderType;
    export type ATAuthUserDTO = CoreTypes.ATAuthUserDTO;
    export type ATAuthSessionDTO = CoreTypes.ATAuthSessionDTO;

    // ATPlatform Types
    export type ATPlatformLoginResponseDTO = import("./providers/atplatform/atplatform.login.types").ATPlatformLoginResponseDTO;
    export type ATPlatformAccessTokenPayloadDTO = import("./providers/atplatform/atplatform.token.types").ATPlatformAccessTokenPayloadDTO;

    // Parto Types
    export type PartoUserInfoDTO = import("./providers/parto/parto.login.types").PartoUserInfoDTO;
    export type PartoLoginResponseDTO = import("./providers/parto/parto.login.types").PartoLoginResponseDTO;
    export type PartoAccessTokenPayloadDTO = import("./providers/parto/parto.token.types").PartoAccessTokenPayloadDTO;
}

// Export runtime under a clean namespace
export { Runtime };
