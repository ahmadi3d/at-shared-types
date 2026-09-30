import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";

/** Existing `cat.business_models.id` is the sole model identity. */
export interface WorkflowModelSummary {
    id: number;
    /** Read-only server-derived BPMN process key. */
    key: string;
    title: string;
    description: string | null;
    revision: number;
    isArchived: boolean;
    latestPublishedVersionNo: number | null;
    updatedAt: string;
}

export interface WorkflowModelDetail extends WorkflowModelSummary {
    /** Existing provider-independent Archive ID; executable BPMN is not in metadata. */
    bpmnArchiveId: string | null;
    metadata?: AtJsonObject | null;
}

export interface WorkflowModelCreateInput {
    title: string;
    description?: string | null;
}

export interface WorkflowModelUpdateInput {
    title: string;
    description?: string | null;
    bpmnArchiveId: string;
    metadata?: AtJsonObject | null;
    expectedRevision: number;
}

export interface WorkflowModelVersionSummary {
    /** Existing `cat.business_model_versions.id`. */
    modelVersionId: number;
    modelId: number;
    versionNo: number;
    bpmnArchiveId: string;
    bpmnSha256: string;
    status: "publishing" | "published" | "failed";
    flowableDeploymentId?: string | null;
    flowableProcessDefinitionId?: string | null;
    flowableProcessDefinitionVersion?: number | null;
    createdAt: string;
    publishedAt?: string | null;
}

export interface WorkflowFrozenElementConfig {
    bpmnElementId: string;
    elementType: "user_task" | "automation" | "process";
    config: AtJsonObject;
    formId: number | null;
    formVersionId: number | null;
    contextPath: string | null;
    scriptSha256: string | null;
}

/** Exact SQL-frozen version; none of these fields comes from the mutable model draft. */
export interface WorkflowModelVersionDetail extends WorkflowModelVersionSummary {
    title: string;
    description: string | null;
    metadata: AtJsonObject | null;
    publishedByUserId: number;
    elementConfigs: WorkflowFrozenElementConfig[];
}

export type WorkflowValidationSeverity = "error" | "warning";

export interface WorkflowValidationIssue {
    code: string;
    severity: WorkflowValidationSeverity;
    message: string;
    elementId?: string | null;
    propertyPath?: string | null;
}

export interface WorkflowValidationResult {
    valid: boolean;
    issues: WorkflowValidationIssue[];
}

export interface WorkflowPublishInput {
    /** Client-generated UUID for idempotency. */
    commandId: string;
    expectedRevision: number;
}

export interface WorkflowPublishResult {
    modelVersionId: number;
    versionNo: number;
    status: "published" | "publishing" | "failed";
    flowableDeploymentId?: string | null;
    flowableProcessDefinitionId?: string | null;
    flowableProcessDefinitionVersion?: number | null;
    bpmnSha256: string;
    validation: WorkflowValidationResult;
}

export interface WorkflowProcedureParameter {
    name: string;
    type: string | null;
    required?: boolean;
    direction?: "input" | "output" | "inputOutput";
}

/** Script autocomplete uses `apiName`, never a physical procedure object name. */
export interface WorkflowProcedureCatalogEntry {
    database: string;
    schema: string;
    apiName: string;
    title: string | null;
    description: string | null;
    parameters?: WorkflowProcedureParameter[];
    metadata?: AtJsonValue | null;
}
