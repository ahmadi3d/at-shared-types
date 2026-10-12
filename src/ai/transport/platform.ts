import type { SnakeKeysDeep, SnakeStr } from "../../casing";
import type { AtJsonObject } from "../../core/domain/json.types";
import type * as Ai from "../domain/platform";

/** Casing applies to protocol fields. Opaque domain payload keys retain their own schema casing. */
type AiWireValue<T> = T extends Ai.AiVersionedPayloadDto
    ? SnakeKeysDeep<Omit<T, "payload">> & { payload: AtJsonObject }
    : T extends readonly (infer Item)[]
        ? AiWireValue<Item>[]
        : T extends object
            ? { [Name in keyof T as Name extends string ? SnakeStr<Name> : Name]: AiWireValue<T[Name]> }
            : T;

export type AiMessageCommandWireDto = AiWireValue<Ai.AiMessageCommandDto>;
export type AiApprovalDecisionWireDto = AiWireValue<Ai.AiApprovalDecisionDto>;
export type AiConversationWireDto = AiWireValue<Ai.AiConversationDto>;
export type AiMessageWireDto = AiWireValue<Ai.AiMessageDto>;
export type AiNoteWireDto = AiWireValue<Ai.AiNoteDto>;
export type AiJobWireDto = AiWireValue<Ai.AiJobDto>;
export type AiApprovalWireDto = AiWireValue<Ai.AiApprovalDto>;
export type AiStreamEventWireDto = AiWireValue<Ai.AiStreamEventDto>;
export type AiToolProposalWireDto = AiWireValue<Ai.AiToolProposalDto>;
export type AiToolResultWireDto = AiWireValue<Ai.AiToolResultDto>;
export type AiModelDisplayWireDto = SnakeKeysDeep<Ai.AiModelDisplayDto>;
export type AiAccessWireDto = SnakeKeysDeep<Ai.AiAccessDto>;
export type AiQuotaOutcomeWireDto = SnakeKeysDeep<Ai.AiQuotaOutcomeDto>;
export type AiUsageWireDto = SnakeKeysDeep<Ai.AiUsageDto>;
