import type { SnakeKeysDeep } from "../../casing";
import type * as DomainEngine from "../domain/engine";
import type * as DomainSession from "../domain/session";
import type * as DomainChat from "../domain/chat";

export type AiChatMessageWireDto = SnakeKeysDeep<DomainEngine.AiChatMessageDto>;
export type AiChatOptionsWireDto = SnakeKeysDeep<DomainEngine.AiChatOptionsDto>;
export type AiRequestContextWireDto = SnakeKeysDeep<DomainEngine.AiRequestContextDto>;
export type AiChatWithIntentOptionsWireDto = SnakeKeysDeep<DomainEngine.AiChatWithIntentOptionsDto>;

export type AiIntentWireDto = SnakeKeysDeep<DomainEngine.AiIntentDto>;
export type AiCapabilityWireDto = SnakeKeysDeep<DomainEngine.AiCapabilityDto>;
export type AiPageContextWireDto = SnakeKeysDeep<DomainEngine.AiPageContextDto>;

export type AiSessionConfigWireDto = SnakeKeysDeep<DomainSession.AiSessionConfigDto>;

// NEW: chat request/response wire types too
export type AiChatRequestWireDto = SnakeKeysDeep<DomainChat.AiChatRequestDto>;
export type AiChatResponseWireDto = SnakeKeysDeep<DomainChat.AiChatResponseDto>;
export type AiChatWithIntentRequestWireDto = SnakeKeysDeep<DomainChat.AiChatWithIntentRequestDto>;
export type AiChatWithIntentResponseWireDto = SnakeKeysDeep<DomainChat.AiChatWithIntentResponseDto>;
