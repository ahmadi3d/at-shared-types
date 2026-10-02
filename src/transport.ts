export type * from "./ai/transport/wire.types";
export type * from "./ai/transport/chat";
export type * from "./core/transport/responses";
export type * from "./archive/transport";
export type * from "./workflow/transport";
export type * from "./authorization/domain";
export type * from "./auth/domain/identity";

export const AtTransportDto = {} as const;

// ✅ type bucket (so AtTransportDto.ResponseErrorDto etc works)
export namespace AtTransportDto {
    export type AtAuthorizationMeDto = import("./authorization/domain").AtAuthorizationMeDto;
    export type AtUserEffectiveExplanationDto = import("./authorization/domain").AtUserEffectiveExplanationDto;
    export type AtTelecomReferencePageDto = import("./authorization/domain").AtTelecomReferencePageDto;
    export type AtSecurityErrorDto = import("./authorization/domain").AtSecurityErrorDto;
    export type ArchiveUploadOptionsWireDto =
        import("./archive/transport").ArchiveUploadOptionsWireDto;
    export type ArchiveFileReferenceWireDto =
        import("./archive/transport").ArchiveFileReferenceWireDto;
    export type ArchiveFileDescriptorWireDto =
        import("./archive/transport").ArchiveFileDescriptorWireDto;
    export type ArchiveUploadResultWireDto =
        import("./archive/transport").ArchiveUploadResultWireDto;

    export type ResponseSuccessDto<T> =
        import("./core/transport/responses").ResponseSuccessDto<T>;
    export type ResponseErrorDto =
        import("./core/transport/responses").ResponseErrorDto;

    export type AiChatRequestDto =
        import("./ai/transport/chat").AiChatRequestDto;
    export type AiChatResponseDto =
        import("./ai/transport/chat").AiChatResponseDto;
    export type AiChatWithIntentRequestDto =
        import("./ai/transport/chat").AiChatWithIntentRequestDto;
    export type AiChatWithIntentResponseDto =
        import("./ai/transport/chat").AiChatWithIntentResponseDto;

    export type AiChatMessageWireDto =
        import("./ai/transport/wire.types").AiChatMessageWireDto;
    export type AiChatOptionsWireDto =
        import("./ai/transport/wire.types").AiChatOptionsWireDto;
    export type AiRequestContextWireDto =
        import("./ai/transport/wire.types").AiRequestContextWireDto;
    export type AiChatWithIntentOptionsWireDto =
        import("./ai/transport/wire.types").AiChatWithIntentOptionsWireDto;

    export type AiIntentWireDto =
        import("./ai/transport/wire.types").AiIntentWireDto;
    export type AiCapabilityWireDto =
        import("./ai/transport/wire.types").AiCapabilityWireDto;
    export type AiPageContextWireDto =
        import("./ai/transport/wire.types").AiPageContextWireDto;

    export type AiSessionConfigWireDto =
        import("./ai/transport/wire.types").AiSessionConfigWireDto;

    export type WorkflowModelSummaryWireDto = import("./workflow/transport").WorkflowModelSummaryWireDto;
    export type WorkflowModelDetailWireDto = import("./workflow/transport").WorkflowModelDetailWireDto;
    export type WorkflowModelCreateInputWireDto = import("./workflow/transport").WorkflowModelCreateInputWireDto;
    export type WorkflowModelUpdateInputWireDto = import("./workflow/transport").WorkflowModelUpdateInputWireDto;
    export type WorkflowModelVersionSummaryWireDto = import("./workflow/transport").WorkflowModelVersionSummaryWireDto;
    export type WorkflowModelVersionDetailWireDto = import("./workflow/transport").WorkflowModelVersionDetailWireDto;
    export type WorkflowFrozenElementConfigWireDto = import("./workflow/transport").WorkflowFrozenElementConfigWireDto;
    export type WorkflowValidationIssueWireDto = import("./workflow/transport").WorkflowValidationIssueWireDto;
    export type WorkflowValidationResultWireDto = import("./workflow/transport").WorkflowValidationResultWireDto;
    export type WorkflowPublishInputWireDto = import("./workflow/transport").WorkflowPublishInputWireDto;
    export type WorkflowPublishResultWireDto = import("./workflow/transport").WorkflowPublishResultWireDto;
    export type WorkflowProcedureParameterWireDto = import("./workflow/transport").WorkflowProcedureParameterWireDto;
    export type WorkflowProcedureCatalogEntryWireDto = import("./workflow/transport").WorkflowProcedureCatalogEntryWireDto;
    export type WorkflowStartInstanceInputWireDto = import("./workflow/transport").WorkflowStartInstanceInputWireDto;
    export type WorkflowStartInstanceResultWireDto = import("./workflow/transport").WorkflowStartInstanceResultWireDto;
    export type WorkflowStartableDefinitionWireDto = import("./workflow/transport").WorkflowStartableDefinitionWireDto;
    export type WorkflowInstanceSummaryWireDto = import("./workflow/transport").WorkflowInstanceSummaryWireDto;
    export type WorkflowInstanceDetailWireDto = import("./workflow/transport").WorkflowInstanceDetailWireDto;
    export type WorkflowTaskSummaryWireDto = import("./workflow/transport").WorkflowTaskSummaryWireDto;
    export type WorkflowInputDataLoadResultWireDto = import("./workflow/transport").WorkflowInputDataLoadResultWireDto;
    export type WorkflowInputDataSaveInputWireDto = import("./workflow/transport").WorkflowInputDataSaveInputWireDto;
    export type WorkflowInputDataSaveResultWireDto = import("./workflow/transport").WorkflowInputDataSaveResultWireDto;
    export type WorkflowCompleteTaskInputWireDto = import("./workflow/transport").WorkflowCompleteTaskInputWireDto;
    export type WorkflowCompleteTaskResultWireDto = import("./workflow/transport").WorkflowCompleteTaskResultWireDto;
    export type WorkflowTaskAssignmentInputWireDto = import("./workflow/transport").WorkflowTaskAssignmentInputWireDto;
    export type WorkflowTaskAssignmentResultWireDto = import("./workflow/transport").WorkflowTaskAssignmentResultWireDto;
    export type WorkflowTimelineEventWireDto = import("./workflow/transport").WorkflowTimelineEventWireDto;
    export type WorkflowTimelineResultWireDto = import("./workflow/transport").WorkflowTimelineResultWireDto;
    export type WorkflowDiagramActivityWireDto = import("./workflow/transport").WorkflowDiagramActivityWireDto;
    export type WorkflowDiagramScopeWireDto = import("./workflow/transport").WorkflowDiagramScopeWireDto;
    export type WorkflowDiagramResultWireDto = import("./workflow/transport").WorkflowDiagramResultWireDto;
    export type WorkflowProcessActionInputWireDto = import("./workflow/transport").WorkflowProcessActionInputWireDto;
    export type WorkflowAdminTerminateInputWireDto = import("./workflow/transport").WorkflowAdminTerminateInputWireDto;
    export type WorkflowCommandResultWireDto = import("./workflow/transport").WorkflowCommandResultWireDto;
}
