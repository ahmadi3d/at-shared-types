import { AIChatMessageDTO } from "../engine";

export interface AIChatResponseDTO {
    message: AIChatMessageDTO;
    usage?: { tokens?: number };
    raw?: any;
    debug?: any,
}