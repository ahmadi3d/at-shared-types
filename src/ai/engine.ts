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

export interface AIChatOptionsDTO {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    engineID?: string;
    responseFormat?: AIChatOptionsResponseFormatDTO;
}

export interface AIChatResponseDTO {
    message: AIChatMessageDTO;
    usage?: { tokens?: number };
    raw?: any;
    debug?: any,
}

export interface AIIntentDTO {
    capabilityID: string,
    params?: object,
    // 0..1
    confidence?: number;
    // why this intent was chosen
    reason?: string;
}

export interface AICapabilityDTO {
    id: string,
    description: string,
}

export interface AIChatWithIntentOptionsDTO extends AIChatOptionsDTO {
    capabilities?: AICapabilityDTO[];
}

