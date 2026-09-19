import type {
    AtJsonObject,
    AtJsonValue,
} from "../../core/domain/json.types";
import type {
    WorkflowReferenceId,
} from "./model";
import type {
    WorkflowTaskActionType,
} from "./execution";

export type WorkflowRequestId = string | number;
export type WorkflowTaskInstanceId = string | number;
export type WorkflowActionExecutionId = string;

/**
 * Safe actor projection exposed to workflow scripts.
 *
 * Authentication tokens, request headers, raw invoker objects, IP/MAC values,
 * and backend request objects are intentionally excluded.
 */
export interface WorkflowScriptActor {
    userId: string | null;
    businessId?: WorkflowReferenceId | null;
    systemId?: WorkflowReferenceId | null;
    customerId?: WorkflowReferenceId | null;
}

export interface WorkflowScriptRequestInfo {
    id: WorkflowRequestId;
    action: WorkflowTaskActionType;
    executionId: WorkflowActionExecutionId;
}

export interface WorkflowScriptTaskInfo {
    /** Runtime task-instance identity. May be null while v1 DBs are linear. */
    instanceId: WorkflowTaskInstanceId | null;
    /** BPMN task/node definition ID. */
    definitionId: string;
    name: string | null;
    formId: WorkflowReferenceId | null;
}

/**
 * Canonical context visible inside task JavaScript.
 *
 * Contract-owned keys are always camelCase, regardless of HTTP/database
 * casing. Workflow variable names authored in BPMS scripts should also use
 * camelCase. Opaque nested business objects are not recursively recased.
 */
export interface WorkflowTaskScriptContext {
    request: WorkflowScriptRequestInfo;
    task: WorkflowScriptTaskInfo;
    input: AtJsonValue | null;
    savedData: AtJsonValue | null;
    variables: Record<string, AtJsonValue>;
    businessData: AtJsonValue | null;
    actor: WorkflowScriptActor;
}

/** Host-supported result envelope returned from load/save/proceed hooks. */
export interface WorkflowTaskScriptResult {
    data?: AtJsonValue;
    variables?: Record<string, AtJsonValue>;
}

/** Context visible to a route condition after the proceed hook succeeds. */
export interface WorkflowConditionScriptContext extends WorkflowTaskScriptContext {
    taskResult: WorkflowTaskScriptResult;
}

export interface WorkflowScriptLogApi {
    info(message: string, data?: AtJsonValue): void;
    warn(message: string, data?: AtJsonValue): void;
    error(message: string, data?: AtJsonValue): void;
}

export type WorkflowDatabaseResultFormat =
    | "object"
    | "array";

/**
 * Registered-procedure call requested from workflow JavaScript.
 *
 * Script authors use camelCase for these contract-owned keys. `parameters`
 * represents procedure parameter names in script-facing camelCase; the host
 * adapter is responsible for normalizing only those immediate parameter names
 * to the database boundary convention. Parameter values remain opaque.
 */
export interface WorkflowDatabaseProcedureCallInput {
    database?: string;
    schema: string;
    apiName: string;
    parameters?: AtJsonObject;
    resultFormat?: WorkflowDatabaseResultFormat;
}

/**
 * Provider-agnostic procedure result visible to scripts.
 *
 * `resultSets` is camelCase because it is part of the workflow API. For
 * object-form rows, the host should normalize immediate database column keys
 * to camelCase before exposing them. Nested JSON/business values remain
 * untouched.
 */
export interface WorkflowDatabaseProcedureCallResult {
    resultSets: AtJsonValue[][];
}

export interface WorkflowScriptDatabaseApi {
    callProcedure(
        input: WorkflowDatabaseProcedureCallInput
    ): Promise<WorkflowDatabaseProcedureCallResult>;
}

/** API surface available to load/save/proceed task scripts. */
export interface WorkflowTaskScriptApi {
    database: WorkflowScriptDatabaseApi;
    log: WorkflowScriptLogApi;
}

/** Read-only host capability surface available to route conditions. */
export interface WorkflowConditionScriptApi {
    log: WorkflowScriptLogApi;
}

export interface WorkflowResolvedRoutePath {
    /** Ordered sequence-flow IDs traversed for this resolved path. */
    flowIds: string[];
    /** Next active BPMN node, or null when this path reaches completion. */
    nextNodeId: string | null;
}

export interface WorkflowRouteResolution {
    paths: WorkflowResolvedRoutePath[];
    completed: boolean;
}

/** Domain request for one workflow task lifecycle command. */
export interface WorkflowTaskActionRequest {
    requestId: WorkflowRequestId;
    taskInstanceId?: WorkflowTaskInstanceId | null;
    actionExecutionId: WorkflowActionExecutionId;
    actionType: WorkflowTaskActionType;
    input?: AtJsonValue | null;
}

/** Domain result returned after the workflow host processes an action. */
export interface WorkflowTaskActionExecutionResult {
    requestId: WorkflowRequestId;
    taskInstanceId: WorkflowTaskInstanceId | null;
    actionExecutionId: WorkflowActionExecutionId;
    actionType: WorkflowTaskActionType;
    taskResult: WorkflowTaskScriptResult;
    route: WorkflowRouteResolution | null;
}
