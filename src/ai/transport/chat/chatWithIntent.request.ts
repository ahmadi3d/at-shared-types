import type { DeepSnakeKeys } from "../../../casing";
import type { AIChatWithIntentRequestDTO as DomainAIChatWithIntentRequestDTO } from "../../domain/chat";

export type AIChatWithIntentRequestDTO = DeepSnakeKeys<DomainAIChatWithIntentRequestDTO>;
