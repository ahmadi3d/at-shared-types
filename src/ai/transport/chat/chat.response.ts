import type { AIChatMessageWireDTO } from "../wire.types";

export interface AIChatResponseDTO {
    message: AIChatMessageWireDTO;
    usage?: { tokens?: number };
    raw?: any;
    debug?: any;
}
