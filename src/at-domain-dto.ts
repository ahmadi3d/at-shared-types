import type * as Engine from "./ai/domain/engine";
import type * as Session from "./ai/domain/session";

/**
 * Runtime value (empty on purpose) so consumers can:
 *   import { ATDomainDTO } from "at-shared-types"
 * and then use:
 *   ATDomainDTO.SomeType
 */
export const ATDomainDTO = {} as const;

/**
 * Namespace holds ONLY types (and could hold values too if you ever need).
 * TS merges this with the const above.
 */
export namespace ATDomainDTO {
    export type ATChatMessageContentDTO = Engine.ATChatMessageContentDTO;

    export type AIChatMessageDTO = Engine.AIChatMessageDTO;
    export type AIChatOptionsResponseFormatDTO = Engine.AIChatOptionsResponseFormatDTO;

    export type AIRequestContextDTO = Engine.AIRequestContextDTO;
    export type AIChatOptionsDTO = Engine.AIChatOptionsDTO;

    export type AIIntentDTO = Engine.AIIntentDTO;
    export type AICapabilityDTO = Engine.AICapabilityDTO;
    export type AIPageContextDTO = Engine.AIPageContextDTO;

    export type AIChatWithIntentOptionsDTO = Engine.AIChatWithIntentOptionsDTO;

    export type AIPromptRoleDTO = Session.AIPromptRoleDTO;
    export type AISessionConfigDTO = Session.AISessionConfigDTO;
}
