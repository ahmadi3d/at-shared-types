import type { DeepSnakeKeys } from "../../../casing";
import type { AIChatResponseDTO as DomainAIChatResponseDTO } from "../../domain/chat";

export type AIChatResponseDTO = DeepSnakeKeys<DomainAIChatResponseDTO>;
