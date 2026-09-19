/**
 * Lifecycle action requested for a workflow user task.
 *
 * The backend owns the semantics of each action. In particular, `proceed`
 * may complete the current BPMN task and advance workflow execution after the
 * configured task logic succeeds.
 */
export type WorkflowTaskActionType =
    | "load"
    | "save"
    | "proceed";

/**
 * Version of the script-visible workflow API (`ctx` + `api`).
 *
 * This is deliberately independent from the workflow JSON schema version so
 * published workflows can keep running against API v1 after a future API v2
 * is introduced.
 */
export type WorkflowScriptApiVersion = 1;

/**
 * Script languages supported by workflow script execution.
 *
 * Kept explicit so the persisted contract does not silently assume a runtime
 * language if another supported script engine is introduced later.
 */
export type WorkflowScriptLanguage = "javascript";

/**
 * Script-backed task execution.
 *
 * `source` is one task module. The workflow runtime selects the exported hook
 * matching the requested WorkflowTaskActionType (load/save/proceed).
 */
export interface WorkflowScriptTaskExecutionConfig {
    language: WorkflowScriptLanguage;
    apiVersion: WorkflowScriptApiVersion;
    source: string;
}

/**
 * Maps each workflow task execution mode to its configuration contract.
 *
 * Add future execution strategies here (for example `config` or `decision`)
 * without changing consumers of WorkflowTaskExecutionDefinition.
 */
export interface WorkflowTaskExecutionConfigMap {
    script: WorkflowScriptTaskExecutionConfig;
}

export type WorkflowTaskExecutionMode =
    keyof WorkflowTaskExecutionConfigMap;

/**
 * Persistable execution definition attached to a workflow task.
 *
 * This discriminated union intentionally keeps `script` as one strategy
 * rather than making scripting the workflow model itself.
 */
export type WorkflowTaskExecutionDefinition = {
    [Mode in WorkflowTaskExecutionMode]: {
        mode: Mode;
        config: WorkflowTaskExecutionConfigMap[Mode];
    };
}[WorkflowTaskExecutionMode];
