import type { AiResourceReferenceDto, AiVersionedPayloadDto } from "./platform";

/** Original and current owning diffs expose base/current/proposed changes without a generic merge or executable repair. */
export interface AiResourceConflictReviewDto {
    contractVersion: 1;
    approvalId: string;
    jobId: string;
    commandId: string;
    status: "current" | "conflict";
    base: AiResourceReferenceDto;
    current: AiResourceReferenceDto;
    originalChange: AiVersionedPayloadDto;
    currentChange: AiVersionedPayloadDto;
    resolution: "none" | "new_preview_required";
}
