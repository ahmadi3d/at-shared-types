import { SnakeKeysDeep } from "../../../casing";
import type { AiChatWithIntentResponseDto as DomainAiChatWithIntentResponseDto } from "../../domain/chat";

export type AiChatWithIntentResponseDto = SnakeKeysDeep<DomainAiChatWithIntentResponseDto>;
