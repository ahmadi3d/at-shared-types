import type { SnakeKeys } from "../../casing";
import type {
    WorkflowAdminTerminateInput,
    WorkflowCommandResult,
    WorkflowCompleteTaskInput,
    WorkflowCompleteTaskResult,
    WorkflowDiagramActivity,
    WorkflowDiagramResult,
    WorkflowInstanceDetail,
    WorkflowInstanceSummary,
    WorkflowModelCreateInput,
    WorkflowModelDetail,
    WorkflowModelSummary,
    WorkflowModelUpdateInput,
    WorkflowModelVersionSummary,
    WorkflowProcedureCatalogEntry,
    WorkflowProcedureParameter,
    WorkflowProcessActionInput,
    WorkflowPublishInput,
    WorkflowPublishResult,
    WorkflowSaveDraftInput,
    WorkflowSaveDraftResult,
    WorkflowStartInstanceInput,
    WorkflowStartInstanceResult,
    WorkflowTaskAssignmentInput,
    WorkflowTaskAssignmentResult,
    WorkflowTaskOpenInput,
    WorkflowTaskOpenResult,
    WorkflowTaskSummary,
    WorkflowTimelineEvent,
    WorkflowTimelineResult,
    WorkflowValidationIssue,
    WorkflowValidationResult,
} from "../domain";

/** Wire keys are snake_case. Opaque JSON/form/context values keep their own keys. */
export type WorkflowModelSummaryWireDto = SnakeKeys<WorkflowModelSummary>;
export type WorkflowModelDetailWireDto = SnakeKeys<WorkflowModelDetail>;
export type WorkflowModelCreateInputWireDto = SnakeKeys<WorkflowModelCreateInput>;
export type WorkflowModelUpdateInputWireDto = SnakeKeys<WorkflowModelUpdateInput>;
export type WorkflowModelVersionSummaryWireDto = SnakeKeys<WorkflowModelVersionSummary>;
export type WorkflowValidationIssueWireDto = SnakeKeys<WorkflowValidationIssue>;
export interface WorkflowValidationResultWireDto extends Omit<WorkflowValidationResult, "issues"> {
    issues: WorkflowValidationIssueWireDto[];
}
export type WorkflowPublishInputWireDto = SnakeKeys<WorkflowPublishInput>;
export type WorkflowPublishResultWireDto = SnakeKeys<Omit<WorkflowPublishResult, "validation">> & {
    validation: WorkflowValidationResultWireDto;
};
export type WorkflowProcedureParameterWireDto = SnakeKeys<WorkflowProcedureParameter>;
export type WorkflowProcedureCatalogEntryWireDto = SnakeKeys<Omit<WorkflowProcedureCatalogEntry, "parameters">> & {
    parameters?: WorkflowProcedureParameterWireDto[];
};

export type WorkflowStartInstanceInputWireDto = SnakeKeys<WorkflowStartInstanceInput>;
export type WorkflowStartInstanceResultWireDto = SnakeKeys<WorkflowStartInstanceResult>;
export type WorkflowInstanceSummaryWireDto = SnakeKeys<WorkflowInstanceSummary>;
export type WorkflowInstanceDetailWireDto = SnakeKeys<WorkflowInstanceDetail>;
export type WorkflowTaskSummaryWireDto = SnakeKeys<WorkflowTaskSummary>;
export type WorkflowTaskOpenInputWireDto = SnakeKeys<WorkflowTaskOpenInput>;
export type WorkflowTaskOpenResultWireDto = SnakeKeys<Omit<WorkflowTaskOpenResult, "task" | "form" | "completionActions">> & {
    task: WorkflowTaskSummaryWireDto;
    form: SnakeKeys<WorkflowTaskOpenResult["form"]>;
    completion_actions: SnakeKeys<WorkflowTaskOpenResult["completionActions"][number]>[];
};
export type WorkflowSaveDraftInputWireDto = SnakeKeys<WorkflowSaveDraftInput>;
export type WorkflowSaveDraftResultWireDto = SnakeKeys<WorkflowSaveDraftResult>;
export type WorkflowCompleteTaskInputWireDto = SnakeKeys<WorkflowCompleteTaskInput>;
export type WorkflowCompleteTaskResultWireDto = SnakeKeys<WorkflowCompleteTaskResult>;
export type WorkflowTaskAssignmentInputWireDto = SnakeKeys<WorkflowTaskAssignmentInput>;
export type WorkflowTaskAssignmentResultWireDto = SnakeKeys<WorkflowTaskAssignmentResult>;
export type WorkflowTimelineEventWireDto = SnakeKeys<WorkflowTimelineEvent>;
export type WorkflowTimelineResultWireDto = SnakeKeys<Omit<WorkflowTimelineResult, "events">> & {
    events: WorkflowTimelineEventWireDto[];
};
export type WorkflowDiagramActivityWireDto = SnakeKeys<WorkflowDiagramActivity>;
export type WorkflowDiagramResultWireDto = SnakeKeys<Omit<WorkflowDiagramResult, "historicActivities">> & {
    historic_activities: WorkflowDiagramActivityWireDto[];
};
export type WorkflowProcessActionInputWireDto = SnakeKeys<WorkflowProcessActionInput>;
export type WorkflowAdminTerminateInputWireDto = SnakeKeys<WorkflowAdminTerminateInput>;
export type WorkflowCommandResultWireDto = SnakeKeys<WorkflowCommandResult>;
