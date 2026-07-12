export type * from "./ai/domain/engine";
export type * from "./ai/domain/session";
export type * from "./ai/domain/chat";

/**
 * Runtime value so consumers can use:
 *   import { AtDomainDto } from "at-shared-types/domain";
 *   AtDomainDto.<autocomplete>
 */
export const AtDomainDto = {} as const;

/**
 * Merge types into the runtime value for dot-access.
 * This is emitted correctly by tsc (not tsup dts bundler).
 */
export namespace AtDomainDto {
    export type AiChatUsageDto =
        import("./ai/domain/chat").AiChatUsageDto;

    export type AiChatResponseDto =
        import("./ai/domain/chat").AiChatResponseDto;

    export type AiChatWithIntentResponseDto =
        import("./ai/domain/chat").AiChatWithIntentResponseDto;

    export type AtChatMessageContentDto =
        import("./ai/domain/engine").AtChatMessageContentDto;

    export type AiChatMessageDto =
        import("./ai/domain/engine").AiChatMessageDto;

    export type AiChatOptionsResponseFormatDto =
        import("./ai/domain/engine").AiChatOptionsResponseFormatDto;

    export type AiRequestContextDto =
        import("./ai/domain/engine").AiRequestContextDto;

    export type AiChatOptionsDto =
        import("./ai/domain/engine").AiChatOptionsDto;

    export type AiIntentDto =
        import("./ai/domain/engine").AiIntentDto;

    export type AiCapabilityDto =
        import("./ai/domain/engine").AiCapabilityDto;

    export type AiPageContextDto =
        import("./ai/domain/engine").AiPageContextDto;

    export type AiChatWithIntentOptionsDto =
        import("./ai/domain/engine").AiChatWithIntentOptionsDto;

    export type AiPromptRoleDto =
        import("./ai/domain/session").AiPromptRoleDto;

    export type AiSessionConfigDto =
        import("./ai/domain/session").AiSessionConfigDto;
}
