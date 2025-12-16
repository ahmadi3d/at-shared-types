import { AIChatMessageDTO, AIChatWithIntentOptionsDTO } from "../engine";

export interface AIChatWithIntentRequestDTO {
    session_id: string;
    messages: AIChatMessageDTO[];
    options?: AIChatWithIntentOptionsDTO;
}