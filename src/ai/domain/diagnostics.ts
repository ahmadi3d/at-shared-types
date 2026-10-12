export interface AiDiagnosticResultDto {
    contractVersion: 1;
    code: string;
    category:
        | "authentication"
        | "authorization"
        | "validation"
        | "conflict"
        | "admission"
        | "reconciliation"
        | "unknown";
    summary: string;
    findings: Array<{
        certainty: "confirmed" | "reported" | "hypothesis" | "unknown";
        code: string;
        message: string;
        source: string;
    }>;
    citations: Array<{ sourceId: string; version: number; chunkId: string; sha256: string; heading: string }>;
    navigation: Array<{
        target:
            | "page"
            | "ai-job"
            | "workflow-operation"
            | "workflow-instance"
            | "workflow-task"
            | "workflow-publication";
        id: string;
        resourceId?: string;
    }>;
}
