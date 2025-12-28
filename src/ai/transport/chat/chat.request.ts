import type { AIChatMessageWireDTO, AIChatWithIntentOptionsWireDTO } from "../wire.types";

export interface AIChatRequestDTO {
  session_id: string;
  messages: AIChatMessageWireDTO[];
  options?: AIChatWithIntentOptionsWireDTO;
}
