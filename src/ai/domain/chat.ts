import type {
    AiChatMessageDto,
    AiChatWithIntentOptionsDto,
    AiIntentDto,
} from "./engine";

export interface AiChatUsageDto {
    tokens?: number;
}

/** Internal/domain request (camelCase) */
export interface AiChatRequestDto {
    sessionId: string;
    messages: AiChatMessageDto[];
    options?: AiChatWithIntentOptionsDto;
}

/** Domain response (camelCase) */
export interface AiChatResponseDto {
    message: AiChatMessageDto;
    usage?: AiChatUsageDto;
    engineId?: string;
    raw?: unknown;
    debug?: unknown;
}

/** Domain request (camelCase) */
export interface AiChatWithIntentRequestDto {
    sessionId: string;
    messages: AiChatMessageDto[];
    options?: AiChatWithIntentOptionsDto;
}

/** Domain response (camelCase) */
export interface AiChatWithIntentResponseDto extends AiChatResponseDto {
    intents?: AiIntentDto[];
}
