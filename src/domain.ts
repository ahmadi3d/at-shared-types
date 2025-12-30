export type * from "./ai/domain/engine";
export type * from "./ai/domain/session";
export type * from "./ai/domain/chat";

/**
 * Runtime value so consumers can use:
 *   import { ATDomainDTO } from "at-shared-types/domain";
 *   ATDomainDTO.<autocomplete>
 */
export const ATDomainDTO = {} as const;

/**
 * Merge types into the runtime value for dot-access.
 * This is emitted correctly by tsc (not tsup dts bundler).
 */
export namespace ATDomainDTO {
    export type AIChatUsageDTO =
        import("./ai/domain/chat").AIChatUsageDTO;

    export type AIChatResponseDTO =
        import("./ai/domain/chat").AIChatResponseDTO;

    export type AIChatWithIntentResponseDTO =
        import("./ai/domain/chat").AIChatWithIntentResponseDTO;

    export type ATChatMessageContentDTO =
        import("./ai/domain/engine").ATChatMessageContentDTO;

    export type AIChatMessageDTO =
        import("./ai/domain/engine").AIChatMessageDTO;

    export type AIChatOptionsResponseFormatDTO =
        import("./ai/domain/engine").AIChatOptionsResponseFormatDTO;

    export type AIRequestContextDTO =
        import("./ai/domain/engine").AIRequestContextDTO;

    export type AIChatOptionsDTO =
        import("./ai/domain/engine").AIChatOptionsDTO;

    export type AIIntentDTO =
        import("./ai/domain/engine").AIIntentDTO;

    export type AICapabilityDTO =
        import("./ai/domain/engine").AICapabilityDTO;

    export type AIPageContextDTO =
        import("./ai/domain/engine").AIPageContextDTO;

    export type AIChatWithIntentOptionsDTO =
        import("./ai/domain/engine").AIChatWithIntentOptionsDTO;

    export type AIPromptRoleDTO =
        import("./ai/domain/session").AIPromptRoleDTO;

    export type AISessionConfigDTO =
        import("./ai/domain/session").AISessionConfigDTO;
}
