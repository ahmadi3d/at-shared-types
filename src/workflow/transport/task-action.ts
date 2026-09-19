import type { SnakeKeys } from "../../casing";
import type {
    WorkflowResolvedRoutePath,
    WorkflowRouteResolution,
    WorkflowTaskActionExecutionResult,
    WorkflowTaskActionRequest,
    WorkflowTaskScriptResult,
} from "../domain";

/**
 * HTTP/wire request for a workflow task action.
 *
 * Only contract-owned top-level keys are converted to snake_case. `input` is
 * opaque workflow/business JSON and its keys are intentionally preserved.
 */
export type WorkflowTaskActionRequestWireDto =
    SnakeKeys<WorkflowTaskActionRequest>;

/** Wire form of one resolved BPMN path. */
export type WorkflowResolvedRoutePathWireDto =
    SnakeKeys<WorkflowResolvedRoutePath>;

/** Wire route result; path-owned fields are snake_case. */
export interface WorkflowRouteResolutionWireDto {
    paths: WorkflowResolvedRoutePathWireDto[];
    completed: WorkflowRouteResolution["completed"];
}

/**
 * Wire result for a workflow task action.
 *
 * Contract-owned transport keys are snake_case. `task_result.data` and
 * `task_result.variables` remain opaque business/workflow values and are not
 * recursively recased.
 */
export interface WorkflowTaskActionExecutionResultWireDto {
    request_id: WorkflowTaskActionExecutionResult["requestId"];
    task_instance_id: WorkflowTaskActionExecutionResult["taskInstanceId"];
    action_execution_id: WorkflowTaskActionExecutionResult["actionExecutionId"];
    action_type: WorkflowTaskActionExecutionResult["actionType"];
    task_result: WorkflowTaskScriptResult;
    route: WorkflowRouteResolutionWireDto | null;
}
