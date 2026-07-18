import type {
    DataSourceConfigMap,
    DataSourceType,
} from "./config";

/**
 * Fully resolved/valid data-source value.
 *
 * The config type is automatically correlated with the discriminator.
 *
 * For example:
 *
 * { type: "enum", config: EnumDataSourceConfig }
 * { type: "api", config: ApiDataSourceConfig }
 */
export type DataSourceValue = {
    [Type in DataSourceType]: {
        type: Type;
        config: DataSourceConfigMap[Type];
    };
}[DataSourceType];

/**
 * Editable/incomplete representation of a data source.
 *
 * Used while constructing/configuring a data source before it becomes
 * a fully valid DataSourceValue.
 */
export type DataSourceValueDraft =
    | {
        type: null;
        config: Record<string, never>;
    }
    | {
        [Type in DataSourceType]: {
            type: Type;
            config: Partial<DataSourceConfigMap[Type]>;
        };
    }[DataSourceType];