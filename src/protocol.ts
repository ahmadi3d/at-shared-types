export * from "./core/protocol/errors";

import { AtApiErrorCodeMap } from "./core/protocol/errors";

import { AtAiId } from "./ai/protocol/ids";
import { AtAiPrompts } from "./ai/protocol/prompts";
import { AtAiCapabilities } from "./ai/protocol/capabilities";

export const AtAi = {
    Id: AtAiId,
    Prompts: AtAiPrompts,
    Capabilities: AtAiCapabilities,
} as const;

export const AtProtocol = {
    AtApiErrorCodeMap,
    Ai: AtAi,
} as const;

export type AtAiCapabilityId =
    import("./ai/protocol/ids").AtAiCapabilityId;
export type AtAiPromptId =
    import("./ai/protocol/ids").AtAiPromptId;

export type AtApiErrorCode =
    import("./core/protocol/errors").AtApiErrorCode;
