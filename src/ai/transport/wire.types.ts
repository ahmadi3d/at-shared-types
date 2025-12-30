import type { DeepSnakeKeys } from "../../casing";
import type * as DomainEngine from "../domain/engine";
import type * as DomainSession from "../domain/session";
import type * as DomainChat from "../domain/chat";

export type AIChatMessageWireDTO = DeepSnakeKeys<DomainEngine.AIChatMessageDTO>;
export type AIChatOptionsWireDTO = DeepSnakeKeys<DomainEngine.AIChatOptionsDTO>;
export type AIRequestContextWireDTO = DeepSnakeKeys<DomainEngine.AIRequestContextDTO>;
export type AIChatWithIntentOptionsWireDTO = DeepSnakeKeys<DomainEngine.AIChatWithIntentOptionsDTO>;

export type AIIntentWireDTO = DeepSnakeKeys<DomainEngine.AIIntentDTO>;
export type AICapabilityWireDTO = DeepSnakeKeys<DomainEngine.AICapabilityDTO>;
export type AIPageContextWireDTO = DeepSnakeKeys<DomainEngine.AIPageContextDTO>;

export type AISessionConfigWireDTO = DeepSnakeKeys<DomainSession.AISessionConfigDTO>;

// NEW: chat request/response wire types too
export type AIChatRequestWireDTO = DeepSnakeKeys<DomainChat.AIChatRequestDTO>;
export type AIChatResponseWireDTO = DeepSnakeKeys<DomainChat.AIChatResponseDTO>;
export type AIChatWithIntentRequestWireDTO = DeepSnakeKeys<DomainChat.AIChatWithIntentRequestDTO>;
export type AIChatWithIntentResponseWireDTO = DeepSnakeKeys<DomainChat.AIChatWithIntentResponseDTO>;
