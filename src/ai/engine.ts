export type ATChatMessageContentDTO =
    | string
    | null;

/**
 * Internal representation — can include nulls for assistant messages, etc.
 */
export type AIChatMessageDTO =
    | { role: "system"; content: ATChatMessageContentDTO }
    | { role: "user"; content: ATChatMessageContentDTO }
    | { role: "assistant"; content: ATChatMessageContentDTO };

export type AIChatOptionsResponseFormatDTO =
    | {
        type: "text";
    }
    | {
        type: "json";
        jsonSchema?: Record<string, any>;
    };

// Contextual information for the request coming from the application
export interface AIRequestContextDTO {
    messages?: AIChatMessageDTO[],
    sessionID?: string,
    engine?: string,
    engineType?: string,
}

export interface AIChatOptionsDTO {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    engineID?: string;
    responseFormat?: AIChatOptionsResponseFormatDTO;
    requestContext?: AIRequestContextDTO,
}

export interface AIIntentDTO {
    capabilityID: string,
    params?: object,
    // 0..1
    confidence?: number;
    // why this intent was chosen
    reason?: string;
    output?: unknown,
}

export interface AICapabilityDTO {
    id: string,
    description: string,
}

export interface AIPageContextDTO {
    location?: string,
    data?: unknown,
}

export interface AIChatWithIntentOptionsDTO extends AIChatOptionsDTO {
    capabilities?: AICapabilityDTO[];
    pageContext?: AIPageContextDTO;
}