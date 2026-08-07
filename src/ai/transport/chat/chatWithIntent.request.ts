import type { SnakeKeysDeep } from "../../../casing";
import type { AiChatWithIntentRequestDto as DomainAiChatWithIntentRequestDto } from "../../domain/chat";

export type AiChatWithIntentRequestDto = SnakeKeysDeep<DomainAiChatWithIntentRequestDto>;
