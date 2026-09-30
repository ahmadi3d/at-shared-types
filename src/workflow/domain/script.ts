import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";
import type { WorkflowScriptHook } from "./execution";
import type { WorkflowReferenceId } from "./model";

export interface WorkflowScriptExecutionContext {
    /** Stable identity for a logical command/job, including retries. */
    id: string;
    hook: WorkflowScriptHook;
    attempt: number;
    isRetry: boolean;
}

export interface WorkflowScriptProcessContext {
    instanceId: number | string;
    flowableProcessInstanceId: string;
    modelVersionId: number | string;
    businessKey: string | null;
}

export interface WorkflowScriptTaskContext {
    /** Actual Flowable task ID, not the BPMN element ID. */
    instanceId: string;
    definitionId: string;
    name: string | null;
    formId: WorkflowReferenceId | null;
    formVersionId: WorkflowReferenceId | null;
    contextPath: string | null;
}

export interface WorkflowScriptActionContext {
    key: string;
}

export type WorkflowScriptActorKind = "user" | "system";

export interface WorkflowScriptActor {
    kind: WorkflowScriptActorKind;
    userId: string | number | null;
    initiatorUserId: string | number | null;
    businessId?: string | number | null;
    systemId?: string | number | null;
    customerId?: string | number | null;
}

export interface WorkflowScriptContext {
    execution: WorkflowScriptExecutionContext;
    process: WorkflowScriptProcessContext;
    task?: WorkflowScriptTaskContext | null;
    action?: WorkflowScriptActionContext | null;
    input: AtJsonValue | null;
    data: AtJsonValue | null;
    /** Mutable JSON clone. The host persists it only at the appropriate boundary. */
    context: AtJsonObject;
    actor: WorkflowScriptActor;
}

export interface WorkflowScriptResult {
    data?: AtJsonValue;
    /** Deep-merges over direct `ctx.context` mutations. Arrays replace. */
    contextPatch?: AtJsonObject;
    /** Accepted only from proceed/execute; reserved `at*` names are rejected. */
    variables?: Record<string, AtJsonValue>;
}

export type WorkflowDatabaseResultFormat = "object" | "array";

export interface WorkflowDatabaseProcedureCallInput {
    database?: string;
    schema: string;
    /** Logical registered API name, never the physical procedure name. */
    apiName: string;
    parameters?: Record<string, AtJsonValue>;
    resultFormat?: WorkflowDatabaseResultFormat;
}

export interface WorkflowDatabaseProcedureCallResult {
    resultSets: AtJsonValue[][];
    rowsAffected?: number[];
    output?: Record<string, AtJsonValue>;
}

export interface WorkflowScriptDatabaseApi {
    callProcedure(input: WorkflowDatabaseProcedureCallInput): Promise<WorkflowDatabaseProcedureCallResult>;
}

export interface WorkflowScriptLogApi {
    debug(message: string, data?: AtJsonValue): void | Promise<void>;
    info(message: string, data?: AtJsonValue): void | Promise<void>;
    warn(message: string, data?: AtJsonValue): void | Promise<void>;
    error(message: string, data?: AtJsonValue): void | Promise<void>;
}

export interface WorkflowScriptApi {
    database: WorkflowScriptDatabaseApi;
    log: WorkflowScriptLogApi;
}
