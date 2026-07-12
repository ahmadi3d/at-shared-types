export type * from "./ai/transport/wire.types";
export type * from "./ai/transport/chat";
export type * from "./core/transport/responses";

export const AtTransportDto = {} as const;

// ✅ type bucket (so AtTransportDto.ResponseErrorDto etc works)
export namespace AtTransportDto {
  export type ResponseSuccessDto<T> =
    import("./core/transport/responses").ResponseSuccessDto<T>;
  export type ResponseErrorDto =
    import("./core/transport/responses").ResponseErrorDto;

  export type AiChatRequestDto =
    import("./ai/transport/chat").AiChatRequestDto;
  export type AiChatResponseDto =
    import("./ai/transport/chat").AiChatResponseDto;
  export type AiChatWithIntentRequestDto =
    import("./ai/transport/chat").AiChatWithIntentRequestDto;
  export type AiChatWithIntentResponseDto =
    import("./ai/transport/chat").AiChatWithIntentResponseDto;

  export type AiChatMessageWireDto =
    import("./ai/transport/wire.types").AiChatMessageWireDto;
  export type AiChatOptionsWireDto =
    import("./ai/transport/wire.types").AiChatOptionsWireDto;
  export type AiRequestContextWireDto =
    import("./ai/transport/wire.types").AiRequestContextWireDto;
  export type AiChatWithIntentOptionsWireDto =
    import("./ai/transport/wire.types").AiChatWithIntentOptionsWireDto;

  export type AiIntentWireDto =
    import("./ai/transport/wire.types").AiIntentWireDto;
  export type AiCapabilityWireDto =
    import("./ai/transport/wire.types").AiCapabilityWireDto;
  export type AiPageContextWireDto =
    import("./ai/transport/wire.types").AiPageContextWireDto;

  export type AiSessionConfigWireDto =
    import("./ai/transport/wire.types").AiSessionConfigWireDto;
}
