import type { DeepSnakeKeys } from "../../casing";

import type {
    AIChatMessageDTO,
    AIChatWithIntentOptionsDTO,
    AIChatOptionsDTO,
    AIRequestContextDTO,
    AIIntentDTO,
    AICapabilityDTO,
    AIPageContextDTO,
} from "../domain/engine";
import type { AISessionConfigDTO } from "../domain/session";

export type AIChatMessageWireDTO = DeepSnakeKeys<AIChatMessageDTO>;
export type AIChatOptionsWireDTO = DeepSnakeKeys<AIChatOptionsDTO>;
export type AIRequestContextWireDTO = DeepSnakeKeys<AIRequestContextDTO>;
export type AIChatWithIntentOptionsWireDTO = DeepSnakeKeys<AIChatWithIntentOptionsDTO>;

export type AIIntentWireDTO = DeepSnakeKeys<AIIntentDTO>;
export type AICapabilityWireDTO = DeepSnakeKeys<AICapabilityDTO>;
export type AIPageContextWireDTO = DeepSnakeKeys<AIPageContextDTO>;

export type AISessionConfigWireDTO = DeepSnakeKeys<AISessionConfigDTO>;
