import type { SnakeKeysDeep } from "../../../casing";
import type { AiChatRequestDto as DomainAiChatRequestDto } from "../../domain/chat";

export type AiChatRequestDto = SnakeKeysDeep<DomainAiChatRequestDto>;
