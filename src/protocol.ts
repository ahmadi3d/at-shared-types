export * from "./core/protocol/errors";

import { ATAPIErrorCodeMap } from "./core/protocol/errors";

import { ATAIID } from "./ai/protocol/ids";
import { ATAIPrompts } from "./ai/protocol/prompts";
import { ATAICapabilities } from "./ai/protocol/capabilities";

export const ATAI = {
    ID: ATAIID,
    Prompts: ATAIPrompts,
    Capabilities: ATAICapabilities,
} as const;

export const ATProtocol = {
    ATAPIErrorCodeMap,
    AI: ATAI,
} as const;

export type ATAICapabilityID =
    import("./ai/protocol/ids").ATAICapabilityID;
export type ATAIPromptID =
    import("./ai/protocol/ids").ATAIPromptID;

export type ATAPIErrorCode =
    import("./core/protocol/errors").ATAPIErrorCode;
