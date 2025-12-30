export type * from "./ai/transport/wire.types";
export type * from "./ai/transport/chat";
export type * from "./core/transport/responses";

export { ATAPIErrorCodeDTO } from "./core/transport/errors";
export type { ATAPIErrorCodeDTO as ATAPIErrorCodeDTOType } from "./core/transport/errors";

export namespace ATTransportDTO {
  export type ResponseSuccessDTO<T> =
    import("./core/transport/responses").ResponseSuccessDTO<T>;

  export type ResponseErrorDTO =
    import("./core/transport/responses").ResponseErrorDTO;

  export type AIChatRequestDTO =
    import("./ai/transport/chat").AIChatRequestDTO;

  export type AIChatResponseDTO =
    import("./ai/transport/chat").AIChatResponseDTO;

  export type AIChatWithIntentRequestDTO =
    import("./ai/transport/chat").AIChatWithIntentRequestDTO;

  export type AIChatWithIntentResponseDTO =
    import("./ai/transport/chat").AIChatWithIntentResponseDTO;

  export type AIChatMessageWireDTO =
    import("./ai/transport/wire.types").AIChatMessageWireDTO;

  export type AIChatOptionsWireDTO =
    import("./ai/transport/wire.types").AIChatOptionsWireDTO;

  export type AIRequestContextWireDTO =
    import("./ai/transport/wire.types").AIRequestContextWireDTO;

  export type AIChatWithIntentOptionsWireDTO =
    import("./ai/transport/wire.types").AIChatWithIntentOptionsWireDTO;

  export type AIIntentWireDTO =
    import("./ai/transport/wire.types").AIIntentWireDTO;

  export type AICapabilityWireDTO =
    import("./ai/transport/wire.types").AICapabilityWireDTO;

  export type AIPageContextWireDTO =
    import("./ai/transport/wire.types").AIPageContextWireDTO;

  export type AISessionConfigWireDTO =
    import("./ai/transport/wire.types").AISessionConfigWireDTO;
}
