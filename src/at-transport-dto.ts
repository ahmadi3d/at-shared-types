import type * as AIWire from "./ai/transport/wire.types";
import type * as AIChat from "./ai/transport/chat";
import {
    ATAPIErrorCodeDTO as ATAPIErrorCodeConst,
    type ATAPIErrorCodeDTO as ATAPIErrorCodeType,
} from "./core/transport/errors";
import type * as CoreResponses from "./core/transport/responses";

export const ATTransportDTO = {
    ATAPIErrorCodeDTO: ATAPIErrorCodeConst,
} as const;

export namespace ATTransportDTO {
    // expose the union type
    export type ATAPIErrorCodeDTO = ATAPIErrorCodeType;

    // core response DTOs
    export type ResponseSuccessDTO<T> = CoreResponses.ResponseSuccessDTO<T>;
    export type ResponseErrorDTO = CoreResponses.ResponseErrorDTO;

    // AI transport request/response DTOs
    export type AIChatRequestDTO = AIChat.AIChatRequestDTO;
    export type AIChatResponseDTO = AIChat.AIChatResponseDTO;
    export type AIChatWithIntentRequestDTO = AIChat.AIChatWithIntentRequestDTO;
    export type AIChatWithIntentResponseDTO = AIChat.AIChatWithIntentResponseDTO;

    // wire DTOs
    export type AIChatMessageWireDTO = AIWire.AIChatMessageWireDTO;
    export type AIChatOptionsWireDTO = AIWire.AIChatOptionsWireDTO;
    export type AIRequestContextWireDTO = AIWire.AIRequestContextWireDTO;
    export type AIChatWithIntentOptionsWireDTO = AIWire.AIChatWithIntentOptionsWireDTO;

    export type AIIntentWireDTO = AIWire.AIIntentWireDTO;
    export type AICapabilityWireDTO = AIWire.AICapabilityWireDTO;
    export type AIPageContextWireDTO = AIWire.AIPageContextWireDTO;

    export type AISessionConfigWireDTO = AIWire.AISessionConfigWireDTO;
}
