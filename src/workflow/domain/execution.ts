/** Script API and AT extension payloads are a clean V2 contract. */
export type WorkflowScriptApiVersion = 2;
export type WorkflowScriptLanguage = "javascript";
export type WorkflowScriptHook = "load" | "save" | "proceed" | "execute";

export interface WorkflowScriptExecutionConfig {
    language: WorkflowScriptLanguage;
    apiVersion: WorkflowScriptApiVersion;
    source: string;
}

export interface WorkflowUserTaskScriptExecution {
    mode: "script";
    config: WorkflowScriptExecutionConfig;
}

export interface WorkflowAutomationScriptExecution {
    mode: "script";
    config: WorkflowScriptExecutionConfig;
}
