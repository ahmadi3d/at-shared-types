import type { AtJsonObject } from "../../core/domain/json.types";
import type { AtPermissionKey } from "../../authorization/domain";

export type AiMode = "ask" | "assist" | "delegate";
export type AiEffort = "low" | "medium" | "high";
export type AiOutcome =
    | "ok"
    | "refused"
    | "validation_failed"
    | "unsupported_version"
    | "migration_required"
    | "failed";
export type AiJobState =
    | "queued"
    | "running"
    | "waiting_approval"
    | "retry_wait"
    | "cancelling"
    | "cancelled"
    | "succeeded"
    | "failed"
    | "manual_review";
export type AiApprovalState = "pending" | "approved" | "denied" | "expired" | "invalidated";
export type AiToolRisk = "read" | "transient" | "draft" | "modify" | "publish" | "business_write";

/** Set by authenticated server composition, never taken from a browser request. */
export interface AiOwnerScope {
    applicationId: string;
    securityAuthorityId: string;
    userId: string;
}

export interface AiResourceReferenceDto {
    resourceType: string;
    resourceId: string;
    revision: string;
    schemaVersion: number;
}

/** Page adapters supply identifiers/revisions; arbitrary raw editor state is not a wire contract. */
export interface AiPageContextDtoV1 {
    pageId: string;
    integrationVersion: number;
    resource?: AiResourceReferenceDto;
    editorRevision?: string;
    /** Binds persisted work to the reviewed page contract, including tools and context schema. */
    integrationFingerprint?: string;
}

export interface AiProtocolEnvelopeDto {
    contractVersion: 1;
    id: string;
    traceId: string;
}

/** Domain schemas own payload contents. Envelope/tool versions remain independent. */
export interface AiVersionedPayloadDto {
    schemaId: string;
    schemaVersion: number;
    payload: AtJsonObject;
}

export interface AiValidationIssueDto {
    path: string;
    code: string;
    message: string;
}

export interface AiUsageDto {
    inputTokens: number;
    outputTokens: number;
    estimatedMicroUsd: string;
    actualMicroUsd: string | null;
}

export interface AiModelDisplayDto {
    id: string;
    label: string;
    supportsStreaming: boolean;
    supportsStructuredOutput: boolean;
    supportsToolProposals: boolean;
}

export interface AiAccessDto {
    enabled: boolean;
    isAdmin: boolean;
    allowedModes: AiMode[];
    effortSelectable: boolean;
    defaultEffort: "low";
}

export interface AiQuotaOutcomeDto {
    allowed: boolean;
    reason:
        | "allowed"
        | "access_denied"
        | "rate_limit"
        | "period_budget"
        | "job_concurrency"
        | "global_budget"
        | "kill_switch";
    resetAt: string | null;
}

export interface AiToolDescriptorDto {
    id: string;
    version: number;
    description: string;
    risk: AiToolRisk;
    allowedModes: AiMode[];
    requiredPermissionKeys: AtPermissionKey[];
    execution: "server" | "foreground";
    resourceScope: "application" | "resource";
    resourceType?: string;
    pageIds: string[];
    pageIntegrationVersion?: number;
    timeoutMs: number;
    idempotency: "read_only" | "command" | "transaction_receipt" | "foreground_ack";
    inputSchemaId: string;
    inputSchemaVersion: number;
    outputSchemaId: string;
    outputSchemaVersion: number;
    owner?: { backend: string; schema: string; fixtures: string[] };
    lifecycle?: "active" | "deprecated";
    migration?: { replacementToolId: string; replacementVersion: number; guidance: string };
}

export interface AiToolProposalDto extends AiProtocolEnvelopeDto {
    toolCallId: string;
    stepId: string;
    toolId: string;
    toolVersion: number;
    resource?: AiResourceReferenceDto;
    input: AiVersionedPayloadDto;
}

interface AiToolResultEnvelopeDto extends AiProtocolEnvelopeDto {
    toolCallId: string;
    stepId: string;
    toolId: string;
    toolVersion: number;
}

export type AiToolResultDto = AiToolResultEnvelopeDto &
    (
        | { outcome: "ok"; output: AiVersionedPayloadDto }
        | { outcome: "validation_failed"; issues: AiValidationIssueDto[] }
        | { outcome: Exclude<AiOutcome, "ok" | "validation_failed">; issues?: AiValidationIssueDto[] }
    );

export interface AiResultCardDto extends AiVersionedPayloadDto {
    cardId: string;
    cardType: string;
    cardVersion: number;
}

export type AiMessagePartDto =
    | { kind: "text"; text: string }
    | { kind: "refusal"; code: string; message: string }
    | { kind: "card"; card: AiResultCardDto }
    | { kind: "tool_result"; result: AiToolResultDto };

export interface AiConversationDto {
    id: string;
    title: string;
    mode: AiMode;
    revision: string;
    archived?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AiMessageDto {
    id: string;
    conversationId: string;
    commandId: string;
    sequence: string;
    role: "user" | "assistant" | "tool";
    parts: AiMessagePartDto[];
    createdAt: string;
}

export interface AiNoteDto {
    id: string;
    title: string;
    text: string;
    pinned: boolean;
    association?: AiNoteAssociationDto;
    revision: string;
    createdAt: string;
    updatedAt: string;
}

/** A private bookmark is never a context or permission grant. */
export type AiNoteAssociationDto =
    | { conversationId: string }
    | { pageContext: AiPageContextDtoV1 & { resource: AiResourceReferenceDto } };

export interface AiNoteCommandDto extends AiProtocolEnvelopeDto {
    commandId: string;
    title: string;
    text: string;
    pinned: boolean;
    association?: AiNoteAssociationDto;
    expectedRevision?: string;
}

export interface AiProgressDto {
    phase: string;
    completedSteps: number;
    totalSteps: number | null;
    message: string;
}

export interface AiJobDto {
    id: string;
    commandId: string;
    conversationId: string;
    state: AiJobState;
    revision: string;
    progress: AiProgressDto;
    resource?: AiResourceReferenceDto;
    createdAt: string;
    updatedAt: string;
}

export interface AiApprovalDto {
    id: string;
    conversationId: string;
    jobId?: string;
    toolCallId: string;
    toolId: string;
    toolVersion: number;
    resource: AiResourceReferenceDto;
    actionDigest: string;
    state: AiApprovalState;
    revision: string;
    expiresAt: string;
}

export interface AiMessageCommandDto extends AiProtocolEnvelopeDto {
    commandId: string;
    conversationId: string;
    expectedRevision: string;
    mode: AiMode;
    text: string;
    /** Higher effort is a server-authorized admin preference; it does not select a provider or model. */
    effort?: AiEffort;
    pageContext?: AiPageContextDtoV1;
    /** Owning app validates a bounded structural projection; Assist previews never confer authority. */
    editorPreview?: AiVersionedPayloadDto;
}

export interface AiApprovalDecisionDto extends AiProtocolEnvelopeDto {
    commandId: string;
    approvalId: string;
    expectedRevision: string;
    actionDigest: string;
    decision: "approve" | "deny";
}

export interface AiPageRequestDto {
    cursor?: string;
    limit: number;
}

export interface AiPageDto<T> {
    items: T[];
    nextCursor: string | null;
}

export type AiStreamEventData = {
    "message.delta": { messageId: string; text: string };
    "message.completed": { message: AiMessageDto };
    "tool.proposed": { proposal: AiToolProposalDto };
    "tool.completed": { result: AiToolResultDto };
    "approval.required": { approval: AiApprovalDto };
    "job.progress": { jobId: string; state: AiJobState; progress: AiProgressDto };
    partial_result: { card: AiResultCardDto };
    refusal: { code: string; message: string };
    "validation.failed": { issues: AiValidationIssueDto[] };
    usage: { usage: AiUsageDto };
    error: { code: string; outcome: Exclude<AiOutcome, "ok"> };
};

export type AiStreamEventDto = {
    [Kind in keyof AiStreamEventData]: AiProtocolEnvelopeDto & {
        conversationId: string;
        sequence: string;
        occurredAt: string;
        kind: Kind;
        data: AiStreamEventData[Kind];
    };
}[keyof AiStreamEventData];
