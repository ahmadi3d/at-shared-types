import type {
    WorkflowAutomationScriptExecution,
    WorkflowUserTaskScriptExecution,
} from "./execution";

/** References to database-backed catalog entries, such as forms. */
export type WorkflowReferenceId = number | string;

export type WorkflowCompletionActionIntent = "primary" | "secondary" | "danger";

/** Presentation and confirmation only. Routing is modeled in BPMN. */
export interface WorkflowCompletionAction {
    key: string;
    label: string;
    confirmationMessage?: string | null;
    intent?: WorkflowCompletionActionIntent;
}

/** Legacy authored draft shape, accepted only by the explicit draft upgrade helper. */
export interface WorkflowUserTaskDefinitionV2 {
    version: 2;
    formId: WorkflowReferenceId;
    contextPath: string;
    outcomePath?: string | null;
    completionActions?: WorkflowCompletionAction[];
    execution?: WorkflowUserTaskScriptExecution | null;
}

export type WorkflowTaskMatchMode = "ANY" | "ALL";

/** Predicates in one clause are ANDed; each predicate uses its own match mode. */
export interface WorkflowTaskEligibilityClause {
    roleKeys?: string[];
    roleMatch?: WorkflowTaskMatchMode;
    permissionKeys?: string[];
    permissionMatch?: WorkflowTaskMatchMode;
}

/** Clauses are ORed, then effective permission exclusions are applied. */
export interface WorkflowTaskEligibilityPolicy {
    anyOf: WorkflowTaskEligibilityClause[];
    excludedPermissionKeys?: string[];
}

/** Immutable published legacy contract. Form identity does not grant task access. */
export interface WorkflowUserTaskDefinitionV3 extends Omit<WorkflowUserTaskDefinitionV2, "version"> {
    version: 3;
    eligibility: WorkflowTaskEligibilityPolicy;
}

/** Current `at:TaskData`: platform Save followed by one Proceed using the saved draft. */
export interface WorkflowTaskMultiInstance {
    /** Relative to the canonical atContext object; native BPMN evaluates this collection. */
    collectionPath: string;
    itemVariable: string;
    /** Omitted means Flowable's native loopCounter. */
    indexVariable?: string;
    sequential: boolean;
    /** Paths are relative to the engine-local item, never browser form data. */
    resourceScope: {
        telecomUnitPath: string;
        billingRunReviewIdPath?: string;
    };
}

export interface WorkflowUserTaskDefinitionV4 {
    version: 4;
    formId: WorkflowReferenceId;
    contextPath: string;
    eligibility: WorkflowTaskEligibilityPolicy;
    /** Only load/proceed exports are accepted by publication and execution. */
    execution?: WorkflowUserTaskScriptExecution | null;
    multiInstance?: WorkflowTaskMultiInstance;
}

export type WorkflowUserTaskDefinition = WorkflowUserTaskDefinitionV3 | WorkflowUserTaskDefinitionV4;

/** `at:AutomationData` on an external-worker BPMN Service Task. */
export interface WorkflowAutomationDefinitionV2 {
    version: 2;
    execution: WorkflowAutomationScriptExecution;
}

export type WorkflowGlobalEventType = "signal" | "message";

export interface WorkflowGlobalActionEvent {
    type: WorkflowGlobalEventType;
    name: string;
}

/** Declares an already modeled BPMN event subscription. */
export interface WorkflowGlobalAction {
    key: string;
    label: string;
    confirmationMessage?: string | null;
    intent?: WorkflowCompletionActionIntent;
    event: WorkflowGlobalActionEvent;
}

/** `at:ProcessData` on the executable root process. */
export interface WorkflowProcessDefinitionV2 {
    version: 2;
    globalActions?: WorkflowGlobalAction[];
}
