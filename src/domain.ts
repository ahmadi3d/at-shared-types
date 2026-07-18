export type * from "./ai/domain/engine";
export type * from "./ai/domain/session";
export type * from "./ai/domain/chat";

export type * from "./dataSource/domain";

/**
 * Runtime value so consumers can use:
 *
 * import { AtDomainDto } from "at-shared-types/domain";
 *
 * AtDomainDto.<type>
 */
export const AtDomainDto = {} as const;

export namespace AtDomainDto {
    // =========================================================
    // AI
    // =========================================================

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


    // =========================================================
    // Data Source
    // =========================================================

    export type DataSourceType =
        import("./dataSource/domain").DataSourceType;

    export type DataSourceConfig =
        import("./dataSource/domain").DataSourceConfig;

    export type DataSourceConfigMap =
        import("./dataSource/domain").DataSourceConfigMap;

    export type EnumDataSourceConfig =
        import("./dataSource/domain").EnumDataSourceConfig;

    export type DatabaseDataSourceConfig =
        import("./dataSource/domain").DatabaseDataSourceConfig;

    export type ApiDataSourceConfig =
        import("./dataSource/domain").ApiDataSourceConfig;

    export type ManualDataSourceConfig =
        import("./dataSource/domain").ManualDataSourceConfig;

    export type DataSourceValue =
        import("./dataSource/domain").DataSourceValue;

    export type DataSourceValueDraft =
        import("./dataSource/domain").DataSourceValueDraft;
}