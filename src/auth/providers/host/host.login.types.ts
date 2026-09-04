import type { PartoLoginResponseDto } from "../parto/parto.login.types";

/**
 * The current host authentication bridge exposes the same login/session
 * payload shape as Parto. Keeping a distinct alias allows host auth to remain
 * a first-class provider while preserving compatibility with the bridge.
 */
export type HostLoginResponseDto = PartoLoginResponseDto;
