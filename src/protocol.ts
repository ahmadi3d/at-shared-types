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

export * from "./authorization/protocol/schemas";
export * from "./ai/protocol/platform-schemas";
export * from "./ai/protocol/platform-validation";
export * from "./ai/protocol/page-integrations";
export * from "./workflow/protocol/task-policy";
export * from "./workflow/protocol/route-condition";
export * from "./ai/protocol/tool-turns";
export * from "./ai/protocol/jobs";
export * from "./ai/protocol/resource-conflicts";

export * from "./ai/protocol/diagnostics";
export * from "./ai/protocol/usage";
export * from "./ai/protocol/form-authoring";
export * from "./ai/form-maker/compile-form";
export * from "./ai/protocol/api-authoring";
export * from "./ai/api-integration/compile-api";
export * from "./ai/protocol/contract-authoring";
export * from "./ai/data-contract/compile-contract";
export * from "./ai/protocol/bpmn-authoring";
export * from "./ai/bpmn/compile-bpmn";
