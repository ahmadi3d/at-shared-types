import type { SnakeKeysDeep } from "../../../casing";
import type { AiChatResponseDto as DomainAiChatResponseDto } from "../../domain/chat";

export type AiChatResponseDto = SnakeKeysDeep<DomainAiChatResponseDto>;
