export type * from "./core/domain/json.types";
export type * from "./archive/domain";
export type * from "./ai/domain/engine";
export type * from "./ai/domain/session";
export type * from "./ai/domain/chat";

export type * from "./dataShape/domain";
export type * from "./dataContract/domain";
export type * from "./runtime/domain";
export type * from "./dataSource/domain";
export type * from "./dataResource/domain";
export type * from "./workflow/domain";

/**
 * Runtime value so consumers can use:
 *
 * import { AtDomainDto } from "at-shared-types/domain";
 *
 * AtDomainDto.<type>
 */
export const AtDomainDto = {} as const;

export namespace AtDomainDto {
    // =========================================================
    // Archive
    // =========================================================

    export type ArchiveId = import("./archive/domain").ArchiveId;
    export type ArchiveBucket = import("./archive/domain").ArchiveBucket;
    export type ArchiveMetadata = import("./archive/domain").ArchiveMetadata;
    export type ArchiveChecksumEncoding = import("./archive/domain").ArchiveChecksumEncoding;
    export type ArchiveChecksum = import("./archive/domain").ArchiveChecksum;
    export type ArchiveFileProperties = import("./archive/domain").ArchiveFileProperties;
    export type ArchiveFileReference = import("./archive/domain").ArchiveFileReference;
    export type ArchiveFileDescriptor = import("./archive/domain").ArchiveFileDescriptor;
    export type ArchiveUploadOptions = import("./archive/domain").ArchiveUploadOptions;
    export type ArchiveUploadResult = import("./archive/domain").ArchiveUploadResult;

    // =========================================================
    // Data Shape / Runtime Values
    // =========================================================

    export type DataShapeKind = import("./dataShape/domain").DataShapeKind;
    export type DataShape = import("./dataShape/domain").DataShape;
    export type DataShapeField = import("./dataShape/domain").DataShapeField;
    export type UnknownDataShape = import("./dataShape/domain").UnknownDataShape;
    export type StringDataShape = import("./dataShape/domain").StringDataShape;
    export type NumberDataShape = import("./dataShape/domain").NumberDataShape;
    export type IntegerDataShape = import("./dataShape/domain").IntegerDataShape;
    export type BooleanDataShape = import("./dataShape/domain").BooleanDataShape;
    export type ObjectDataShape = import("./dataShape/domain").ObjectDataShape;
    export type ArrayDataShape = import("./dataShape/domain").ArrayDataShape;

    export type RuntimeValueExpressionType = import("./runtime/domain").RuntimeValueExpressionType;
    export type RuntimeValueExpressionMap = import("./runtime/domain").RuntimeValueExpressionMap;
    export type RuntimeValueExpression = import("./runtime/domain").RuntimeValueExpression;
    export type RuntimeValueExpressionDraft = import("./runtime/domain").RuntimeValueExpressionDraft;
    export type ConstantRuntimeValueExpression = import("./runtime/domain").ConstantRuntimeValueExpression;
    export type FormValueRuntimeValueExpression = import("./runtime/domain").FormValueRuntimeValueExpression;
    export type EventRuntimeValueExpression = import("./runtime/domain").EventRuntimeValueExpression;
    export type ActionResultRuntimeValueExpression = import("./runtime/domain").ActionResultRuntimeValueExpression;
    export type VariableRuntimeValueExpression = import("./runtime/domain").VariableRuntimeValueExpression;
    export type ContextRuntimeValueExpression = import("./runtime/domain").ContextRuntimeValueExpression;
    export type JavascriptRuntimeValueExpression = import("./runtime/domain").JavascriptRuntimeValueExpression;
    export type ResourceRuntimeValueExpression = import("./runtime/domain").ResourceRuntimeValueExpression;
    export type RuntimeValueBindingVersion = import("./runtime/domain").RuntimeValueBindingVersion;
    export type RuntimeValueBinding = import("./runtime/domain").RuntimeValueBinding;

    // =========================================================
    // AI
    // =========================================================

    export type AiChatUsageDto =
        import("./ai/domain/chat").AiChatUsageDto;

    export type AiChatResponseDto =
        import("./ai/domain/chat").AiChatResponseDto;

    export type AiChatWithIntentResponseDto =
        import("./ai/domain/chat").AiChatWithIntentResponseDto;

    export type AtChatMessageContentDto =
        import("./ai/domain/engine").AtChatMessageContentDto;

    export type AiChatMessageDto =
        import("./ai/domain/engine").AiChatMessageDto;

    export type AiChatOptionsResponseFormatDto =
        import("./ai/domain/engine").AiChatOptionsResponseFormatDto;

    export type AiRequestContextDto =
        import("./ai/domain/engine").AiRequestContextDto;

    export type AiChatOptionsDto =
        import("./ai/domain/engine").AiChatOptionsDto;

    export type AiIntentDto =
        import("./ai/domain/engine").AiIntentDto;

    export type AiCapabilityDto =
        import("./ai/domain/engine").AiCapabilityDto;

    export type AiPageContextDto =
        import("./ai/domain/engine").AiPageContextDto;

    export type AiChatWithIntentOptionsDto =
        import("./ai/domain/engine").AiChatWithIntentOptionsDto;

    export type AiPromptRoleDto =
        import("./ai/domain/session").AiPromptRoleDto;

    export type AiSessionConfigDto =
        import("./ai/domain/session").AiSessionConfigDto;


    // =========================================================
    // Data Contract
    // =========================================================

    export type DataContractId = import("./dataContract/domain").DataContractId;
    export type DataContractKey = import("./dataContract/domain").DataContractKey;
    export type DataContractVersion = import("./dataContract/domain").DataContractVersion;
    export type DataContractImplementationId = import("./dataContract/domain").DataContractImplementationId;
    export type DataContractEnvironment = import("./dataContract/domain").DataContractEnvironment;
    export type DataContractReference = import("./dataContract/domain").DataContractReference;
    export type DataContractStatus = import("./dataContract/domain").DataContractStatus;
    export type DataContractEffect = import("./dataContract/domain").DataContractEffect;
    export type DataContractMockDefinition = import("./dataContract/domain").DataContractMockDefinition;
    export type DataContractVersionDefinition = import("./dataContract/domain").DataContractVersionDefinition;
    export type DataContractDefinition = import("./dataContract/domain").DataContractDefinition;
    export type DataContractDocument = import("./dataContract/domain").DataContractDocument;
    export type DataContractRecord = import("./dataContract/domain").DataContractRecord;
    export type DataContractImplementationType = import("./dataContract/domain").DataContractImplementationType;
    export type DataContractImplementationStatus = import("./dataContract/domain").DataContractImplementationStatus;
    export type DataContractImplementationDefinition<TConfig extends import("./core/domain/json.types").AtJsonObject = import("./core/domain/json.types").AtJsonObject> =
        import("./dataContract/domain").DataContractImplementationDefinition<TConfig>;
    export type DataContractImplementationRecord<TConfig extends import("./core/domain/json.types").AtJsonObject = import("./core/domain/json.types").AtJsonObject> =
        import("./dataContract/domain").DataContractImplementationRecord<TConfig>;
    export type DataContractInvocationRequest = import("./dataContract/domain").DataContractInvocationRequest;
    export type DataContractInvocationMode = import("./dataContract/domain").DataContractInvocationMode;
    export type DataContractInvocationMetadata = import("./dataContract/domain").DataContractInvocationMetadata;
    export type DataContractInvocationResult = import("./dataContract/domain").DataContractInvocationResult;
    export type DataContractValidationPhase = import("./dataContract/domain").DataContractValidationPhase;
    export type DataContractValidationIssueCode = import("./dataContract/domain").DataContractValidationIssueCode;
    export type DataContractValidationIssue = import("./dataContract/domain").DataContractValidationIssue;
    export type DataContractValidationFailure = import("./dataContract/domain").DataContractValidationFailure;

    // =========================================================
    // Data Source
    // =========================================================

    export type DataSourceType =
        import("./dataSource/domain").DataSourceType;

    export type DataSourceConfig =
        import("./dataSource/domain").DataSourceConfig;

    export type DataSourceConfigMap =
        import("./dataSource/domain").DataSourceConfigMap;

    export type StaticDataSourceConfig =
        import("./dataSource/domain").StaticDataSourceConfig;

    export type EnumDataSourceConfig =
        import("./dataSource/domain").EnumDataSourceConfig;

    export type DatabaseDataSourceConfig =
        import("./dataSource/domain").DatabaseDataSourceConfig;

    export type DatabaseDataSourceObjectType =
        import("./dataSource/domain").DatabaseDataSourceObjectType;

    export type DatabaseProcedureDataSourceConfig =
        import("./dataSource/domain").DatabaseProcedureDataSourceConfig;

    export type DatabaseTableDataSourceConfig =
        import("./dataSource/domain").DatabaseTableDataSourceConfig;

    export type DatabaseTableQuery =
        import("./dataSource/domain").DatabaseTableQuery;

    export type DatabaseTableQueryOrder =
        import("./dataSource/domain").DatabaseTableQueryOrder;

    export type DatabaseTableQueryOrderDirection =
        import("./dataSource/domain").DatabaseTableQueryOrderDirection;

    export type ApiDataSourceConfig =
        import("./dataSource/domain").ApiDataSourceConfig;

    export type ManualDataSourceConfig =
        import("./dataSource/domain").ManualDataSourceConfig;

    export type DataContractDataSourceConfig = import("./dataSource/domain").DataContractDataSourceConfig;

    export type DataSourceValue =
        import("./dataSource/domain").DataSourceValue;

    export type DataSourceValueDraft =
        import("./dataSource/domain").DataSourceValueDraft;

    export type DataSourceExecutionResult<TRaw = unknown, TSourceValue = unknown, TValue = unknown> =
        import("./dataSource/domain").DataSourceExecutionResult<TRaw, TSourceValue, TValue>;

    // =========================================================
    // Data Source Binding / Transform
    // =========================================================

    export type DataSourceBindingVersion =
        import("./dataSource/domain").DataSourceBindingVersion;

    export type DataSourceBinding =
        import("./dataSource/domain").DataSourceBinding;

    export type DataSourceBindingDraft =
        import("./dataSource/domain").DataSourceBindingDraft;

    export type DataSourceInputBindings = import("./dataSource/domain").DataSourceInputBindings;
    export type DataSourceInputBindingsDraft = import("./dataSource/domain").DataSourceInputBindingsDraft;

    export type DataTransformVersion =
        import("./dataSource/domain").DataTransformVersion;

    export type DataTransform =
        import("./dataSource/domain").DataTransform;

    export type DataTransformDraft =
        import("./dataSource/domain").DataTransformDraft;

    export type DataTransformExpression =
        import("./dataSource/domain").DataTransformExpression;

    export type DataTransformPathExpression =
        import("./dataSource/domain").DataTransformPathExpression;

    export type DataTransformConstantExpression =
        import("./dataSource/domain").DataTransformConstantExpression;

    export type DataTransformTemplateExpression =
        import("./dataSource/domain").DataTransformTemplateExpression;

    export type DataTransformStepType =
        import("./dataSource/domain").DataTransformStepType;

    export type DataTransformStepConfigMap =
        import("./dataSource/domain").DataTransformStepConfigMap;

    export type DataTransformStepValue =
        import("./dataSource/domain").DataTransformStepValue;

    export type DataTransformStepValueDraft =
        import("./dataSource/domain").DataTransformStepValueDraft;

    export type SelectPathTransformConfig =
        import("./dataSource/domain").SelectPathTransformConfig;

    export type MapTransformScope =
        import("./dataSource/domain").MapTransformScope;

    export type MapTransformFieldMapping =
        import("./dataSource/domain").MapTransformFieldMapping;

    export type MapTransformConfig =
        import("./dataSource/domain").MapTransformConfig;

    export type FilterTransformComparisonOperator =
        import("./dataSource/domain").FilterTransformComparisonOperator;

    export type FilterTransformRule =
        import("./dataSource/domain").FilterTransformRule;

    export type FilterTransformLogicalOperator =
        import("./dataSource/domain").FilterTransformLogicalOperator;

    export type FilterTransformGroup =
        import("./dataSource/domain").FilterTransformGroup;

    export type FilterTransformCondition =
        import("./dataSource/domain").FilterTransformCondition;

    export type FilterTransformConfig =
        import("./dataSource/domain").FilterTransformConfig;

    export type SortTransformDirection =
        import("./dataSource/domain").SortTransformDirection;

    export type SortTransformNullPlacement =
        import("./dataSource/domain").SortTransformNullPlacement;

    export type SortTransformField =
        import("./dataSource/domain").SortTransformField;

    export type SortTransformConfig =
        import("./dataSource/domain").SortTransformConfig;

    export type DistinctTransformConfig =
        import("./dataSource/domain").DistinctTransformConfig;

    export type LimitTransformConfig =
        import("./dataSource/domain").LimitTransformConfig;

    export type ApplyTransformScope =
        import("./dataSource/domain").ApplyTransformScope;

    export type ApplyTransformConfig =
        import("./dataSource/domain").ApplyTransformConfig;

    export type ApplyTransformConfigDraft =
        import("./dataSource/domain").ApplyTransformConfigDraft;

    export type ParseJsonTransformConfig =
        import("./dataSource/domain").ParseJsonTransformConfig;

    export type JavascriptTransformConfig =
        import("./dataSource/domain").JavascriptTransformConfig;

    // =========================================================
    // Data Resource / Graph
    // =========================================================

    export type DataResourceId = import("./dataResource/domain").DataResourceId;
    export type DataResourceExecutionMode = import("./dataResource/domain").DataResourceExecutionMode;
    export type SourceDataResource = import("./dataResource/domain").SourceDataResource;
    export type ComputedDataResource = import("./dataResource/domain").ComputedDataResource;
    export type DataResource = import("./dataResource/domain").DataResource;
    export type DataGraphVersion = import("./dataResource/domain").DataGraphVersion;
    export type DataGraph = import("./dataResource/domain").DataGraph;
    export type DataResourceReference = import("./dataResource/domain").DataResourceReference;

    // =========================================================
    // Workflow
    // =========================================================

    export type WorkflowTaskActionType = import("./workflow/domain").WorkflowTaskActionType;
    export type WorkflowScriptApiVersion = import("./workflow/domain").WorkflowScriptApiVersion;
    export type WorkflowScriptLanguage = import("./workflow/domain").WorkflowScriptLanguage;
    export type WorkflowScriptTaskExecutionConfig = import("./workflow/domain").WorkflowScriptTaskExecutionConfig;
    export type WorkflowTaskExecutionConfigMap = import("./workflow/domain").WorkflowTaskExecutionConfigMap;
    export type WorkflowTaskExecutionMode = import("./workflow/domain").WorkflowTaskExecutionMode;
    export type WorkflowTaskExecutionDefinition = import("./workflow/domain").WorkflowTaskExecutionDefinition;

    export type WorkflowScriptConditionConfig = import("./workflow/domain").WorkflowScriptConditionConfig;
    export type WorkflowConditionConfigMap = import("./workflow/domain").WorkflowConditionConfigMap;
    export type WorkflowConditionMode = import("./workflow/domain").WorkflowConditionMode;
    export type WorkflowConditionDefinition = import("./workflow/domain").WorkflowConditionDefinition;

    export type WorkflowSchemaVersion = import("./workflow/domain").WorkflowSchemaVersion;
    export type WorkflowReferenceId = import("./workflow/domain").WorkflowReferenceId;
    export type WorkflowNodeKind = import("./workflow/domain").WorkflowNodeKind;
    export type WorkflowProcessDefinition = import("./workflow/domain").WorkflowProcessDefinition;
    export type WorkflowTaskDefinition = import("./workflow/domain").WorkflowTaskDefinition;
    export type WorkflowNodeDefinition = import("./workflow/domain").WorkflowNodeDefinition;
    export type WorkflowFlowDefinition = import("./workflow/domain").WorkflowFlowDefinition;
    export type WorkflowDefinition = import("./workflow/domain").WorkflowDefinition;

    export type WorkflowRequestId = import("./workflow/domain").WorkflowRequestId;
    export type WorkflowTaskInstanceId = import("./workflow/domain").WorkflowTaskInstanceId;
    export type WorkflowActionExecutionId = import("./workflow/domain").WorkflowActionExecutionId;
    export type WorkflowScriptActor = import("./workflow/domain").WorkflowScriptActor;
    export type WorkflowScriptRequestInfo = import("./workflow/domain").WorkflowScriptRequestInfo;
    export type WorkflowScriptTaskInfo = import("./workflow/domain").WorkflowScriptTaskInfo;
    export type WorkflowTaskScriptContext = import("./workflow/domain").WorkflowTaskScriptContext;
    export type WorkflowConditionScriptContext = import("./workflow/domain").WorkflowConditionScriptContext;
    export type WorkflowTaskScriptResult = import("./workflow/domain").WorkflowTaskScriptResult;
    export type WorkflowScriptLogApi = import("./workflow/domain").WorkflowScriptLogApi;
    export type WorkflowDatabaseResultFormat = import("./workflow/domain").WorkflowDatabaseResultFormat;
    export type WorkflowDatabaseProcedureCallInput = import("./workflow/domain").WorkflowDatabaseProcedureCallInput;
    export type WorkflowDatabaseProcedureCallResult = import("./workflow/domain").WorkflowDatabaseProcedureCallResult;
    export type WorkflowScriptDatabaseApi = import("./workflow/domain").WorkflowScriptDatabaseApi;
    export type WorkflowTaskScriptApi = import("./workflow/domain").WorkflowTaskScriptApi;
    export type WorkflowConditionScriptApi = import("./workflow/domain").WorkflowConditionScriptApi;
    export type WorkflowResolvedRoutePath = import("./workflow/domain").WorkflowResolvedRoutePath;
    export type WorkflowRouteResolution = import("./workflow/domain").WorkflowRouteResolution;
    export type WorkflowTaskActionRequest = import("./workflow/domain").WorkflowTaskActionRequest;
    export type WorkflowTaskActionExecutionResult = import("./workflow/domain").WorkflowTaskActionExecutionResult;

}