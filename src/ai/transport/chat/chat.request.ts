import type { DeepSnakeKeys } from "../../../casing";
import type { AIChatRequestDTO as DomainAIChatRequestDTO } from "../../domain/chat";

export type AIChatRequestDTO = DeepSnakeKeys<DomainAIChatRequestDTO>;
