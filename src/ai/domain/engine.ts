export type AtChatMessageContentDto =
    | string
    | null;

/**
 * Internal representation — can include nulls for assistant messages, etc.
 */
export type AiChatMessageDto =
    | { role: "system"; content: AtChatMessageContentDto }
    | { role: "user"; content: AtChatMessageContentDto }
    | { role: "assistant"; content: AtChatMessageContentDto };

export type AiChatOptionsResponseFormatDto =
    | {
        type: "text";
    }
    | {
        type: "json";
        jsonSchema?: Record<string, any>;
    };

// Contextual information for the request coming from the application
export interface AiRequestContextDto {
    messages?: AiChatMessageDto[],
    sessionId?: string,
    engine?: string,
    engineType?: string,
}

export interface AiChatOptionsDto {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    engineId?: string;
    responseFormat?: AiChatOptionsResponseFormatDto;
    requestContext?: AiRequestContextDto,
}

export interface AiIntentDto {
    capabilityId: string,
    params?: object,
    // 0..1
    confidence?: number;
    // why this intent was chosen
    reason?: string;
    output?: unknown,
}

export interface AiCapabilityDto {
    id: string,
    description: string,
}

export interface AiPageContextDto {
    location?: string,
    data?: unknown,
}

export interface AiChatWithIntentOptionsDto extends AiChatOptionsDto {
    capabilities?: AiCapabilityDto[];
    pageContext?: AiPageContextDto | null;
}