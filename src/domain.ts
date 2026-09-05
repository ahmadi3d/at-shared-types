export type * from "./core/domain/json.types";
export type * from "./ai/domain/engine";
export type * from "./ai/domain/session";
export type * from "./ai/domain/chat";

export type * from "./dataShape/domain";
export type * from "./runtime/domain";
export type * from "./dataSource/domain";

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

    export type DataContractId = import("./dataSource/domain").DataContractId;
    export type DataContractVersion = import("./dataSource/domain").DataContractVersion;
    export type DataContractDataSourceConfig = import("./dataSource/domain").DataContractDataSourceConfig;

    export type DataSourceValue =
        import("./dataSource/domain").DataSourceValue;

    export type DataSourceValueDraft =
        import("./dataSource/domain").DataSourceValueDraft;

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

    export type JavascriptTransformConfig =
        import("./dataSource/domain").JavascriptTransformConfig;

}