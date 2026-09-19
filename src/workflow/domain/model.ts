import type { WorkflowConditionDefinition } from "./condition";
import type { WorkflowTaskExecutionDefinition } from "./execution";

/** Current compact workflow runtime schema. */
export type WorkflowSchemaVersion = 2;

/**
 * Identifier/reference used by configurable task metadata.
 *
 * BPMN definition element IDs themselves remain strings; this union is for
 * references that may originate from database-backed catalogs/forms.
 */
export type WorkflowReferenceId = string | number;

export type WorkflowNodeKind =
    | "task"
    | "startEvent"
    | "endEvent"
    | "intermediateEvent"
    | "gateway"
    | "subProcess"
    | "callActivity"
    | "flowNode";

export interface WorkflowProcessDefinition {
    id: string;
    name: string | null;
}

/**
 * Persisted BPMS metadata for a task definition.
 *
 * All contract-owned application/domain keys are camelCase. Database/provider
 * casing is a persistence concern and must not leak into this model.
 */
export interface WorkflowTaskDefinition {
    version: 1;
    name?: string | null;
    description?: string | null;
    formId?: WorkflowReferenceId | null;
    permissionId?: WorkflowReferenceId | null;
    activityTypeId?: WorkflowReferenceId | null;
    activityNatureId?: WorkflowReferenceId | null;
    includedOrTags?: WorkflowReferenceId[];
    excludedOrTags?: WorkflowReferenceId[];
    includedAndTags?: WorkflowReferenceId[];
    excludedAndTags?: WorkflowReferenceId[];
    isCheckPoint?: boolean;
    allowCommit?: boolean;
    hasGoBack?: boolean;
    hasCancel?: boolean;
    isVolatile?: boolean;
    proceedConfirmationMessage?: string | null;
    execution?: WorkflowTaskExecutionDefinition | null;
}

export interface WorkflowNodeDefinition {
    id: string;
    kind: WorkflowNodeKind;
    type: string;
    name: string | null;
    scopeId: string;
    task?: WorkflowTaskDefinition | null;
}

export interface WorkflowFlowDefinition {
    id: string;
    type: "bpmn:SequenceFlow";
    sourceId: string;
    targetId: string;
    scopeId: string;
    name: string | null;
    condition: WorkflowConditionDefinition | null;
    isDefault: boolean;
}

/**
 * Compact, JSON-only runtime projection of the BPMN definition.
 *
 * XML/editor state and runtime instance state intentionally do not belong in
 * this static definition.
 */
export interface WorkflowDefinition {
    schemaVersion: WorkflowSchemaVersion;
    process: WorkflowProcessDefinition;
    nodes: WorkflowNodeDefinition[];
    flows: WorkflowFlowDefinition[];
}
