import type { DataGraph } from "../../dataResource/domain";
import type { DataTransform } from "../../dataSource/domain/transform";
import type { RuntimeValueExpression } from "../../runtime/domain/valueExpression";

/** The backend owns profile resolution, credentials, connection and transaction. */
export interface DataContractDatabaseQueryConfig {
    connectionProfileId: string;
    engine?: "knex";
    /** Restricted query-builder code evaluated with db and validated input only. */
    code: string;
    portability: DataContractDatabaseQueryPolicy;
    timeoutMs?: number;
    transaction?: boolean;
}

export interface DataContractDatabaseQueryPolicy {
    mode: "portable";
    /** Version of the approved surface, not a claim of universal SQL portability. */
    version: 1;
}

export interface DataContractQueryDiagnostic {
    code:
    | "forbidden-runtime-access"
    | "raw-query"
    | "dialect-specific-query"
    | "unsupported-query-method"
    | "invalid-query";
    severity: "error" | "warning";
    message: string;
    path?: Array<string | number>;
    line?: number;
    column?: number;
}

export interface DataContractApiConfig {
    apiDefinitionId: string;
    inputs?: Record<string, RuntimeValueExpression>;
    transform?: DataTransform;
    timeoutMs?: number;
}

export interface DataContractScriptConfig {
    language: "javascript";
    apiVersion: 1;
    code: string;
    timeoutMs?: number;
}

/**
 * Implements HOW using existing backend-executable resources. Contract input is
 * available as context.input; output normally selects a resource expression.
 * Backend authorization/capability/cycle policy still applies to every source.
 */
export interface DataContractDataSourceImplementationConfig {
    graph: DataGraph;
    output: RuntimeValueExpression;
}

/** `database` retains its domain discriminator and now means Database Query. */
export interface DataContractImplementationConfigMap {
    database: DataContractDatabaseQueryConfig;
    api: DataContractApiConfig;
    script: DataContractScriptConfig;
    dataSource: DataContractDataSourceImplementationConfig;
}
