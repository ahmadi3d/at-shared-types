import type {
    AIChatMessageDTO,
    AIChatWithIntentOptionsDTO,
    AIIntentDTO,
} from "./engine";

export interface AIChatUsageDTO {
    tokens?: number;
}

/** Internal/domain request (camelCase) */
export interface AIChatRequestDTO {
    sessionID: string;
    messages: AIChatMessageDTO[];
    options?: AIChatWithIntentOptionsDTO;
}

/** Domain response (camelCase) */
export interface AIChatResponseDTO {
    message: AIChatMessageDTO;
    usage?: AIChatUsageDTO;
    engineID?: string;
    raw?: unknown;
    debug?: unknown;
}

/** Domain request (camelCase) */
export interface AIChatWithIntentRequestDTO {
    sessionID: string;
    messages: AIChatMessageDTO[];
    options?: AIChatWithIntentOptionsDTO;
}

/** Domain response (camelCase) */
export interface AIChatWithIntentResponseDTO extends AIChatResponseDTO {
    intents?: AIIntentDTO[];
}
