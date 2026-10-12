import type { AiPageContextDtoV1, AiProtocolEnvelopeDto, AiVersionedPayloadDto } from "./platform";

export type AiTurnStatus =
    | "completed"
    | "partial_success"
    | "approval_required"
    | "denied"
    | "missing_tool"
    | "migration_required"
    | "stale_context"
    | "repair_required"
    | "cancelled"
    | "approval_expired"
    | "tool_unavailable"
    | "provider_refused"
    | "quota_blocked"
    | "spend_blocked"
    | "lease_lost"
    | "manual_review"
    | "limit_reached";

/** Safe summary/card payload. Committed native results remain in the owning job ledger. */
export interface AiTurnOutcomeDto {
    status: AiTurnStatus;
    code: string;
    modelCalls: number;
    usedSteps: number;
    completedTools: number;
    text: string;
    repair: "none" | "review_input" | "reopen_page" | "update_integration" | "review_receipt" | "wait";
    approvalId?: string;
}

/** A server-bound suggestion. Applying it still requires the current owning editor and fresh authorization. */
export interface AiEditorProposalDto {
    text: string;
    actionId: string;
    actionVersion: number;
    expectedPage: AiPageContextDtoV1;
    suggestion: AiVersionedPayloadDto | null;
}

/** A request only targets the active Assist editor. It never authorizes a persisted write. */
export interface AiForegroundRequestDto extends AiProtocolEnvelopeDto {
    commandId: string;
    toolCallId: string;
    stepId: string;
    mode: "assist";
    actionId: string;
    actionVersion: number;
    expectedPage: AiPageContextDtoV1;
    input: AiVersionedPayloadDto;
    timeoutMs: number;
}

export type AiForegroundAckDto = AiProtocolEnvelopeDto & {
    requestId: string;
    commandId: string;
    toolCallId: string;
    stepId: string;
    actionId: string;
    actionVersion: number;
} & (
        | { status: "applied"; editorRevision: string; undoToken: string }
        | { status: "inactive" | "stale" | "denied" | "cancelled" | "unsupported" | "failed" }
    );
