import type {
    WorkflowScriptApiVersion,
    WorkflowScriptLanguage,
} from "./execution";

/**
 * Script-backed routing condition.
 *
 * The workflow runtime must treat condition evaluation as read-only and use
 * the returned boolean only to decide whether the associated route matches.
 */
export interface WorkflowScriptConditionConfig {
    language: WorkflowScriptLanguage;
    apiVersion: WorkflowScriptApiVersion;
    source: string;
}

/**
 * Maps each routing-condition mode to its configuration contract.
 *
 * Future declarative modes such as expressions or decision references can be
 * added here without changing WorkflowConditionDefinition consumers.
 */
export interface WorkflowConditionConfigMap {
    script: WorkflowScriptConditionConfig;
}

export type WorkflowConditionMode =
    keyof WorkflowConditionConfigMap;

/** Condition definition attached to a BPMN route/sequence flow. */
export type WorkflowConditionDefinition = {
    [Mode in WorkflowConditionMode]: {
        mode: Mode;
        config: WorkflowConditionConfigMap[Mode];
    };
}[WorkflowConditionMode];
