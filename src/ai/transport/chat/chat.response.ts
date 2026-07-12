import type { DeepSnakeKeys } from "../../../casing";
import type { AiChatResponseDto as DomainAiChatResponseDto } from "../../domain/chat";

export type AiChatResponseDto = DeepSnakeKeys<DomainAiChatResponseDto>;
