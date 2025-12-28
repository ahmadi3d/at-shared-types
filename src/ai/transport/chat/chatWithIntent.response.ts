import type { AIIntentWireDTO } from "../wire.types";
import type { AIChatResponseDTO } from "./chat.response";

export interface AIChatWithIntentResponseDTO extends AIChatResponseDTO {
  intents?: AIIntentWireDTO[];
}
