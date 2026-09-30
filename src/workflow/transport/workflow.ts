import type { SnakeKeys } from "../../casing";
import type {
    WorkflowAdminTerminateInput,
    WorkflowCommandResult,
    WorkflowCompleteTaskInput,
    WorkflowCompleteTaskResult,
    WorkflowDiagramActivity,
    WorkflowDiagramResult,
    WorkflowDiagramScope,
    WorkflowInstanceDetail,
    WorkflowInstanceSummary,
    WorkflowModelCreateInput,
    WorkflowModelDetail,
    WorkflowModelSummary,
    WorkflowModelUpdateInput,
    WorkflowModelVersionSummary,
    WorkflowModelVersionDetail,
    WorkflowFrozenElementConfig,
    WorkflowProcedureCatalogEntry,
    WorkflowProcedureParameter,
    WorkflowProcessActionInput,
    WorkflowPublishInput,
    WorkflowPublishResult,
    WorkflowInputDataSaveInput,
    WorkflowInputDataSaveResult,
    WorkflowInputDataLoadResult,
    WorkflowStartInstanceInput,
    WorkflowStartInstanceResult,
    WorkflowStartableDefinition,
    WorkflowTaskAssignmentInput,
    WorkflowTaskAssignmentResult,
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
export type WorkflowFrozenElementConfigWireDto = SnakeKeys<Omit<WorkflowFrozenElementConfig, "config">> & {
    config: WorkflowFrozenElementConfig["config"];
};
export type WorkflowModelVersionDetailWireDto = SnakeKeys<Omit<WorkflowModelVersionDetail, "elementConfigs" | "metadata">> & {
    metadata: WorkflowModelVersionDetail["metadata"];
    element_configs: WorkflowFrozenElementConfigWireDto[];
};
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
export type WorkflowStartableDefinitionWireDto = SnakeKeys<WorkflowStartableDefinition>;
export type WorkflowInstanceSummaryWireDto = SnakeKeys<WorkflowInstanceSummary>;
export type WorkflowInstanceDetailWireDto = SnakeKeys<WorkflowInstanceDetail>;
export type WorkflowTaskSummaryWireDto = SnakeKeys<WorkflowTaskSummary>;
export type WorkflowInputDataLoadResultWireDto = SnakeKeys<Omit<WorkflowInputDataLoadResult, "task" | "form" | "completionActions">> & {
    task: WorkflowTaskSummaryWireDto;
    form: SnakeKeys<WorkflowInputDataLoadResult["form"]>;
    completion_actions: SnakeKeys<WorkflowInputDataLoadResult["completionActions"][number]>[];
};
export type WorkflowInputDataSaveInputWireDto = SnakeKeys<WorkflowInputDataSaveInput>;
export type WorkflowInputDataSaveResultWireDto = SnakeKeys<WorkflowInputDataSaveResult>;
export type WorkflowCompleteTaskInputWireDto = SnakeKeys<WorkflowCompleteTaskInput>;
export type WorkflowCompleteTaskResultWireDto = SnakeKeys<WorkflowCompleteTaskResult>;
export type WorkflowTaskAssignmentInputWireDto = SnakeKeys<WorkflowTaskAssignmentInput>;
export type WorkflowTaskAssignmentResultWireDto = SnakeKeys<WorkflowTaskAssignmentResult>;
export type WorkflowTimelineEventWireDto = SnakeKeys<WorkflowTimelineEvent>;
export type WorkflowTimelineResultWireDto = SnakeKeys<Omit<WorkflowTimelineResult, "events">> & {
    events: WorkflowTimelineEventWireDto[];
};
export type WorkflowDiagramActivityWireDto = SnakeKeys<WorkflowDiagramActivity>;
export type WorkflowDiagramScopeWireDto = SnakeKeys<Omit<WorkflowDiagramScope, "historicActivities">> & {
    historic_activities: WorkflowDiagramActivityWireDto[];
};
export type WorkflowDiagramResultWireDto = SnakeKeys<Omit<WorkflowDiagramResult, "historicActivities" | "scopeDiagrams">> & {
    historic_activities: WorkflowDiagramActivityWireDto[];
    scope_diagrams: WorkflowDiagramScopeWireDto[];
};
export type WorkflowProcessActionInputWireDto = SnakeKeys<WorkflowProcessActionInput>;
export type WorkflowAdminTerminateInputWireDto = SnakeKeys<WorkflowAdminTerminateInput>;
export type WorkflowCommandResultWireDto = SnakeKeys<WorkflowCommandResult>;
