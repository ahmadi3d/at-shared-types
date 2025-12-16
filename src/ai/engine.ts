export interface AIGenerateTextOptions {
    engineID?: string;
    type?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
}

export interface AIGenerateTextResult {
    text: string;
    raw?: any;
    engineID: string;
}

export type ATChatMessageContent =
    | string
    | null;

/**
 * Internal representation — can include nulls for assistant messages, etc.
 */
export type AIChatMessage =
    | { role: "system"; content: ATChatMessageContent }
    | { role: "user"; content: ATChatMessageContent }
    | { role: "assistant"; content: ATChatMessageContent };

/**
 * Provider-safe variant (no null content, matches what OpenAI expects)
 */
export type AIChatInputMessage =
    | { role: "system"; content: Exclude<ATChatMessageContent, null> }
    | { role: "user"; content: Exclude<ATChatMessageContent, null> }
    | { role: "assistant"; content: Exclude<ATChatMessageContent, null> };


export type AIChatOptionsResponseFormat =
    | {
        type: "text";
    }
    | {
        type: "json";
        jsonSchema?: Record<string, any>;
    };

export interface AIChatOptions {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    engineID?: string;
    responseFormat?: AIChatOptionsResponseFormat;
}

export interface AIChatResponse {
    message: AIChatMessage;
    usage?: { tokens?: number };
    raw?: any;
    debug?: any,
}

export interface AIIntent {
    capabilityID: string,
    params?: object,
    // 0..1
    confidence?: number;
    // why this intent was chosen
    reason?: string;
}

export interface AICapability {
    id: string,
    description: string,
}

export interface AIChatWithIntentOptions extends AIChatOptions {
    capabilities?: AICapability[];
}

export interface AIChatWithIntentResponse extends AIChatResponse {
    intents?: AIIntent[];
}

export interface AIEmbedOptions {
    model?: string;
    engineID?: string;
}

export interface AIEmbedResponse {
    embeddings: number[] | number[][];
    model: string;
    engineID: string;
}