import type { DeepSnakeKeys } from "../../casing";
import type * as DomainEngine from "../domain/engine";
import type * as DomainSession from "../domain/session";
import type * as DomainChat from "../domain/chat";

export type AiChatMessageWireDto = DeepSnakeKeys<DomainEngine.AiChatMessageDto>;
export type AiChatOptionsWireDto = DeepSnakeKeys<DomainEngine.AiChatOptionsDto>;
export type AiRequestContextWireDto = DeepSnakeKeys<DomainEngine.AiRequestContextDto>;
export type AiChatWithIntentOptionsWireDto = DeepSnakeKeys<DomainEngine.AiChatWithIntentOptionsDto>;

export type AiIntentWireDto = DeepSnakeKeys<DomainEngine.AiIntentDto>;
export type AiCapabilityWireDto = DeepSnakeKeys<DomainEngine.AiCapabilityDto>;
export type AiPageContextWireDto = DeepSnakeKeys<DomainEngine.AiPageContextDto>;

export type AiSessionConfigWireDto = DeepSnakeKeys<DomainSession.AiSessionConfigDto>;

// NEW: chat request/response wire types too
export type AiChatRequestWireDto = DeepSnakeKeys<DomainChat.AiChatRequestDto>;
export type AiChatResponseWireDto = DeepSnakeKeys<DomainChat.AiChatResponseDto>;
export type AiChatWithIntentRequestWireDto = DeepSnakeKeys<DomainChat.AiChatWithIntentRequestDto>;
export type AiChatWithIntentResponseWireDto = DeepSnakeKeys<DomainChat.AiChatWithIntentResponseDto>;
