import type { AIChatMessageWireDTO, AIChatWithIntentOptionsWireDTO } from "../wire.types";

export interface AIChatWithIntentRequestDTO {
    session_id: string;
    messages: AIChatMessageWireDTO[];
    options?: AIChatWithIntentOptionsWireDTO;
}
