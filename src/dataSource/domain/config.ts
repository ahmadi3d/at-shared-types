export interface EnumDataSourceConfig {
    enumId: string;
}

export interface DatabaseDataSourceConfig {
    database: string;
    schema: string;
    table: string;
}

export interface ApiDataSourceConfig {
    apiDefinitionId: string;
}

export interface ManualDataSourceConfig {
    script: string;
}

/**
 * Maps each data-source type to its corresponding configuration.
 *
 * This is the source of truth for the relationship between:
 *
 *   type -> config
 */
export interface DataSourceConfigMap {
    enum: EnumDataSourceConfig;
    database: DatabaseDataSourceConfig;
    api: ApiDataSourceConfig;
    manual: ManualDataSourceConfig;
}

export type DataSourceType = keyof DataSourceConfigMap;

export type DataSourceConfig =
    DataSourceConfigMap[DataSourceType];