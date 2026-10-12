import type {
    AiApprovalDto,
    AiJobDto,
    AiJobState,
    AiProtocolEnvelopeDto,
    AiResourceReferenceDto,
    AiVersionedPayloadDto,
    AiToolRisk,
} from "./platform";
import type { AiTurnOutcomeDto } from "./tool-turns";

export interface AiJobArtifactDto {
    resource: AiResourceReferenceDto;
    label: string;
}

/** Server-owned resource references; consumers resolve links through the owning page integration. */
export interface AiJobResultDto {
    contractVersion: 1;
    outcome: AiTurnOutcomeDto;
    artifacts: AiJobArtifactDto[];
    completedAt: string;
}

export interface AiJobDetailDto {
    job: AiJobDto;
    attempts: number;
    canRetry: boolean;
    failureCode: string | null;
    result: AiJobResultDto | null;
    approvals: AiApprovalDto[];
}

export interface AiJobControlCommandDto extends AiProtocolEnvelopeDto {
    commandId: string;
    jobId: string;
    expectedRevision: string;
}

export interface AiJobListFilterDto {
    conversationId?: string;
    state?: AiJobState;
    resourceType?: string;
    taskClass?: string;
}

export interface AiJobListPageDto {
    items: AiJobDto[];
    /** Current domain authorization can hide rows; a raw owner count is never disclosed. */
    total: null;
    /** Advances over the SQL window, including hidden rows, so a filtered empty page does not end pagination. */
    nextOffset: number | null;
}

/** Exact owning review, displayed as inert data. Only the digest/revision-bound decision authorizes a stored action. */
export interface AiApprovalReviewDto {
    approval: AiApprovalDto;
    kind:
        | "create_draft"
        | "update"
        | "delete"
        | "archive"
        | "publish"
        | "business_write"
        | "workflow_start"
        | "script_activate";
    risk: AiToolRisk;
    change: AiVersionedPayloadDto;
}

export interface AiApprovalDecisionReceiptDto {
    receipt: { id: string; revision: string };
    approval: AiApprovalDto;
}

/** Disjoint identities prevent a pending job from masquerading as a partially saved domain record. */
export type AiManagerProjectionRowDto =
    | { identity: string; kind: "job"; detail: AiJobDetailDto }
    | { identity: string; kind: "resource"; record: AiManagerResourceDto; jobId?: string };

/** Catalog lookup metadata. Opening/editing must reacquire the owning resource's current versioned contract. */
export interface AiManagerResourceDto {
    resourceType: string;
    resourceId: string;
    label: string;
}

export interface AiManagerProjectionRequestDto {
    recordsOffset: number;
    jobsOffset: number;
    limit: number;
}

export interface AiManagerProjectionPageDto {
    rows: AiManagerProjectionRowDto[];
    recordTotal: string | null;
    next: { recordsOffset: number | null; jobsOffset: number | null };
}
