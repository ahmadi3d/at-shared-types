export * from "./core/protocol/errors";
export * from "./ai/protocol/ids";

import { ATAPIErrorCodeMap } from "./core/protocol/errors";
import { ATAIID } from "./ai/protocol/ids";
import { ATAIPrompts } from "./ai/protocol/prompts";
import { ATAICapabilities } from "./ai/protocol/capabilities";

export const ATProtocol = {
    ATAPIErrorCodeMap,
    ATID: {
        ai: ATAIID,
    },
    ATAIPrompts,
    ATAICapabilities
} as const;

export namespace ATProtocol {
    export type ATAPIErrorCode =
        import("./core/protocol/errors").ATAPIErrorCode;
    export type ATAICapabilityID =
        import("./ai/protocol/ids").ATAICapabilityID;
    export type ATAIPromptID =
        import("./ai/protocol/ids").ATAIPromptID;
}
