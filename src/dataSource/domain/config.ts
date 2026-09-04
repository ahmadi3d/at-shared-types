export interface StaticDataSourceConfig {
    data: unknown;
}

export interface EnumDataSourceConfig {
    enumId: string;
}

export type DatabaseDataSourceObjectType =
    | "procedure"
    | "table";

export type DatabaseTableQueryOrderDirection =
    | "asc"
    | "desc";

export interface DatabaseTableQueryOrder {
    column: string;
    direction: DatabaseTableQueryOrderDirection;
}

export interface DatabaseTableQuery {
    /**
     * Physical database column names to return.
     *
     * An empty array means all columns.
     */
    columns: string[];

    /**
     * Maximum number of rows requested by the consumer.
     *
     * The backend must still enforce its own hard maximum.
     */
    limit: number;

    /**
     * Ordered list of database columns used for result ordering.
     */
    orderBy: DatabaseTableQueryOrder[];
}

interface DatabaseDataSourceConfigBase {
    database: string;
    schema: string;
    objectName: string;
}

export interface DatabaseProcedureDataSourceConfig extends DatabaseDataSourceConfigBase {
    objectType: "procedure";
}

export interface DatabaseTableDataSourceConfig extends DatabaseDataSourceConfigBase {
    objectType: "table";
    tableQuery: DatabaseTableQuery;
}

export type DatabaseDataSourceConfig =
    | DatabaseProcedureDataSourceConfig
    | DatabaseTableDataSourceConfig;

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
    static: StaticDataSourceConfig;
    enum: EnumDataSourceConfig;
    database: DatabaseDataSourceConfig;
    api: ApiDataSourceConfig;
    manual: ManualDataSourceConfig;
}

export type DataSourceType = keyof DataSourceConfigMap;

export type DataSourceConfig =
    DataSourceConfigMap[DataSourceType];