/** Script API and AT extension payloads are a clean V2 contract. */
export type WorkflowScriptApiVersion = 2;
export type WorkflowScriptLanguage = "javascript";
export type WorkflowScriptHook = "load" | "save" | "proceed" | "execute";

/** Exact logical routine references are frozen with the published element configuration. */
export interface WorkflowRoutineReference {
    database: string;
    schema: string;
    apiName: string;
    /** Server-owned policy stamp filled during validation/publication. */
    registrationStamp?: string;
}

export interface WorkflowScriptExecutionConfig {
    language: WorkflowScriptLanguage;
    apiVersion: WorkflowScriptApiVersion;
    source: string;
    routineReferences?: WorkflowRoutineReference[];
}

export interface WorkflowUserTaskScriptExecution {
    mode: "script";
    config: WorkflowScriptExecutionConfig;
}

export interface WorkflowAutomationScriptExecution {
    mode: "script";
    config: WorkflowScriptExecutionConfig;
}
