import { AIChatMessageDTO, AIChatWithIntentOptionsDTO } from "../engine";

export interface AIChatRequestDTO {
    session_id: string;
    messages: AIChatMessageDTO[];
    options?: AIChatWithIntentOptionsDTO;
}