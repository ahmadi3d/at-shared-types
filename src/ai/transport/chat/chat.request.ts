import type { DeepSnakeKeys } from "../../../casing";
import type { AiChatRequestDto as DomainAiChatRequestDto } from "../../domain/chat";

export type AiChatRequestDto = DeepSnakeKeys<DomainAiChatRequestDto>;
