import { AIChatResponseDTO, AIIntentDTO } from "../engine";

export interface AIChatWithIntentResponseDTO extends AIChatResponseDTO {
    intents?: AIIntentDTO[];
}