export * from "./core/protocol/errors";
export * from "./ai/protocol/ids";

import { ATAPIErrorCodeMap } from "./core/protocol/errors";
import { ATAIID } from "./ai/protocol/ids";

export const ATProtocol = {
    ATAPIErrorCodeMap,
    ATID: {
        ai: ATAIID,
    }
} as const;

export namespace ATProtocol {
    export type ATAPIErrorCode =
        import("./core/protocol/errors").ATAPIErrorCode;
    export type ATAICapabilityID =
        import("./ai/protocol/ids").ATAICapabilityID;
    export type ATAIPromptID =
        import("./ai/protocol/ids").ATAIPromptID;
}
