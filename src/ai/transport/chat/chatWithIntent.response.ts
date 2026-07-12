import type { DeepSnakeKeys } from "../../../casing";
import type { AiChatWithIntentResponseDto as DomainAiChatWithIntentResponseDto } from "../../domain/chat";

export type AiChatWithIntentResponseDto = DeepSnakeKeys<DomainAiChatWithIntentResponseDto>;
