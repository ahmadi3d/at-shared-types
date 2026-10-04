import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";
import type { WorkflowCompletionAction, WorkflowReferenceId } from "./model";
import type { WorkflowTaxonomy } from "./authoring";

export type WorkflowInstanceState =
    | "starting" | "running" | "suspended" | "completed"
    | "canceling" | "canceled" | "failed";

export interface WorkflowStartableDefinition {
    modelId: number;
    modelVersionId: number;
    versionNo: number;
    key: string;
    title: string;
    description: string | null;
    taxonomy?: WorkflowTaxonomy | null;
    startScopePolicyKey?: "GLOBAL" | "CUSTOMER_OWNER" | "EXPLICIT_TELECOM_UNIT";
}

export interface WorkflowStartInstanceInput {
    /** Accepted only by the server-owned frozen start-scope policy. */
    customerId?: string | null;
    telecomUnitId?: string | null;
    /** Client-generated UUID for idempotency. */
    commandId: string;
    modelId: number;
    businessKey?: string | null;
    context?: AtJsonObject;
}

export interface WorkflowStartInstanceResult {
    instanceId: number;
    state: WorkflowInstanceState;
    modelVersionId: number;
    businessKey: string | null;
    flowableProcessInstanceId: string | null;
    contextVersion: number;
}

export interface WorkflowInstanceSummary extends WorkflowStartInstanceResult {
    modelId: number;
    modelTitle: string;
    startedAt: string | null;
    completedAt: string | null;
}

export interface WorkflowInstanceDetail extends WorkflowInstanceSummary {
    context: AtJsonObject;
    activeTaskIds: string[];
}

export interface WorkflowTaskSummary {
    taskId: string;
    instanceId: number;
    /** BPMN element ID, distinct from actual Flowable task ID. */
    definitionId: string;
    name: string | null;
    description: string | null;
    assignee: string | null;
    owner: string | null;
    createdAt: string | null;
    dueAt: string | null;
    priority: number | null;
    businessKey: string | null;
    modelId: number;
    modelTitle: string;
    modelVersionId: number;
    formId: WorkflowReferenceId;
    formVersionId: WorkflowReferenceId;
    canClaim: boolean;
    canUnclaim: boolean;
}

export interface WorkflowInputDataLoadResult {
    task: WorkflowTaskSummary;
    form: {
        id: WorkflowReferenceId;
        versionId: WorkflowReferenceId;
        title: string | null;
        definition: AtJsonValue;
    };
    data: AtJsonValue;
    /** Canonical context composed with this task's safely rebased draft overlay. */
    context: AtJsonObject;
    /** Host-owned current choices; never persisted as the task draft or process context. */
    runtimeContext?: AtJsonObject;
    contextVersion: number;
    draftVersion: number;
    definitionVersion: 3 | 4;
    hasSavedDraft: boolean;
    draftBaseContextVersion: number | null;
    completionActions: WorkflowCompletionAction[];
}

export interface WorkflowInputDataSaveInput {
    commandId: string;
    data: AtJsonValue;
    expectedDraftVersion: number;
}

export interface WorkflowInputDataSaveResult {
    taskId: string;
    data: AtJsonValue;
    draftVersion: number;
    /** Saving a draft does not increment canonical context version. */
    baseContextVersion: number;
}

export interface WorkflowCompleteTaskInputV3 {
    commandId: string;
    actionKey: string;
    data: AtJsonValue;
    expectedDraftVersion?: number | null;
}

/** The server resolves form data and the sole Proceed operation from the frozen task. */
export interface WorkflowCompleteTaskInputV4 {
    commandId: string;
    expectedDraftVersion: number;
    actionKey?: never;
    data?: never;
}

export type WorkflowCompleteTaskInput = WorkflowCompleteTaskInputV3 | WorkflowCompleteTaskInputV4;

export interface WorkflowCompleteTaskResult {
    taskId: string;
    instanceId: number;
    commandId: string;
    state: "completed" | "pending_remote";
    contextVersion: number;
}

export interface WorkflowTaskAssignmentInput {
    commandId: string;
}

export interface WorkflowTaskAssignmentResult {
    taskId: string;
    assignee: string | null;
    canClaim: boolean;
    canUnclaim: boolean;
}

export interface WorkflowTimelineEvent {
    id: string;
    source: "flowable" | "at";
    type: string;
    occurredAt: string;
    taskId?: string | null;
    elementId?: string | null;
    actorUserId?: string | null;
    details?: AtJsonObject | null;
}

export interface WorkflowTimelineResult {
    instanceId: number;
    events: WorkflowTimelineEvent[];
}

export interface WorkflowDiagramActivity {
    activityInstanceId: string;
    elementId: string;
    startedAt: string | null;
    endedAt: string | null;
}

export interface WorkflowDiagramScope {
    flowableProcessInstanceId: string;
    modelVersionId: number;
    flowableProcessDefinitionId: string;
    bpmnXml: string;
    activeActivityIds: string[];
    activeTaskIds: string[];
    historicActivities: WorkflowDiagramActivity[];
}

export interface WorkflowDiagramResult {
    instanceId: number;
    modelVersionId: number;
    flowableProcessDefinitionId: string;
    bpmnXml: string;
    activeActivityIds: string[];
    activeTaskIds: string[];
    historicActivities: WorkflowDiagramActivity[];
    scopeDiagrams: WorkflowDiagramScope[];
}

export interface WorkflowHealthResult {
    healthy: boolean;
    ebpms: { available: boolean };
    flowableBpmn: {
        available: boolean;
        engine: string | null;
        version: string | null
    };
    flowableExternalJob: { available: boolean };
    worker: {
        enabled: boolean;
        running: boolean;
        lastSuccessfulAcquireAt: string | null;
        lastPollErrorAt: string | null;
        inFlightJobs: number;
    };
    pendingOperationsByState: Record<string, number>;
    oldestPendingOperationAt: string | null;
    oldestPendingOperationAgeMs: number | null;
    staleLocalCompletions: number;
    oldestStaleLocalCompletionAt: string | null;
    oldestStaleLocalCompletionAgeMs: number | null;
    deadOrManualReviewOperations: number;
}

export interface WorkflowProcessActionInput {
    commandId: string;
    payload?: AtJsonValue;
}

export interface WorkflowAdminTerminateInput {
    commandId: string;
    reason: string;
}

export interface WorkflowCommandResult {
    commandId: string;
    instanceId: number;
    state: "succeeded" | "pending_remote" | "manual_review";
}
