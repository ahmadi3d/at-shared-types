import type { DeepSnakeKeys } from "../../../casing";
import type { AIChatWithIntentResponseDTO as DomainAIChatWithIntentResponseDTO } from "../../domain/chat";

export type AIChatWithIntentResponseDTO = DeepSnakeKeys<DomainAIChatWithIntentResponseDTO>;
