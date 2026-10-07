import type {
    AtJsonValue,
    BuiltInDataContractImplementationDefinition,
    CommandDefinition,
    CommandInvocationContext,
    DataContractDataSourceImplementationConfig,
    DataSourceExecutionResult,
    GridTabSelection,
    ResultGridDefinition,
    RuntimeCondition,
    TabularResultBundle,
} from "../src/domain";

export const command = {
    version: 1,
    id: "send-sms",
    presentation: { languageKey: "command.sendSms" },
    enabledWhen: {
        kind: "compare",
        source: { type: "event", path: "command.row.data.mobile" },
        operator: "isNotEmpty",
    },
    flow: {
        rules: [{
            id: "invoke",
            actions: [{
                id: "send",
                type: "resource.invoke",
                config: { resourceId: "communications.sendSms" },
            }],
        }],
    },
    authoring: { presetId: "sendSms", presetVersion: 1 },
} satisfies CommandDefinition;

export const results = {
    version: 1,
    resultSets: [
        { key: "customers", rows: [{ customerId: 1, mobile: "synthetic" }] },
        { key: "summary", rows: [{ count: 1 }] },
    ],
} satisfies TabularResultBundle;

export const grid = {
    version: 1,
    tabs: {
        mode: "configured",
        items: [{
            id: "customers",
            result: { kind: "resultSet", key: "customers" },
            selection: { mode: "multiple", rowKeyPath: "customerId" },
            rowCommands: [command],
        }],
    },
    rowModel: "server",
} satisfies ResultGridDefinition;

export const invocation = {
    commandId: command.id,
    host: { id: "customer-grid", kind: "resultGrid", placement: "row" },
    tabId: "customers",
    row: { index: 0, key: 1, data: results.resultSets[0].rows[0] },
    selection: {
        activeTabId: "customers",
        tabs: {
            customers: {
                tabId: "customers",
                resultSetKey: "customers",
                selection: {
                    mode: "allMatching",
                    excludedKeys: [2],
                    queryContext: { queryKey: "active-customers", inputs: { active: true } },
                },
            },
        },
    },
} satisfies CommandInvocationContext;

export const databaseImplementation = {
    contractVersion: 1,
    type: "database",
    status: "active",
    config: {
        connectionProfileId: "local-development",
        engine: "knex",
        code: "return db('customers').select('customerId').where('active', input.active);",
        portability: { mode: "portable", version: 1 },
    },
} satisfies BuiltInDataContractImplementationDefinition;

export const composition = {
    graph: {
        version: 1,
        resources: {
            customers: {
                id: "customers",
                name: "Customers",
                kind: "source",
                execution: "reactive",
                dataSource: {
                    version: 1,
                    source: { type: "static", config: { data: [{ customerId: 1 }] } },
                },
            },
            summary: {
                id: "summary",
                name: "Summary",
                kind: "source",
                execution: "reactive",
                dataSource: {
                    version: 1,
                    source: { type: "static", config: { data: [{ count: 1 }] } },
                },
            },
            bundle: {
                id: "bundle",
                name: "Bundle",
                kind: "computed",
                execution: "reactive",
                inputs: {
                    customers: { type: "resource", resourceId: "customers" },
                    summary: { type: "resource", resourceId: "summary" },
                },
                transform: { version: 1, steps: [] },
            },
        },
    },
    output: { type: "resource", resourceId: "bundle" },
} satisfies DataContractDataSourceImplementationConfig;

export const canonicalValue: DataSourceExecutionResult<unknown, unknown, number> = {
    raw: {},
    sourceValue: [{ count: 1 }],
    value: 1,
};

// Persisted Command/Grid/context fixtures contain JSON data, not host instances.
export const serializedFixtures: AtJsonValue = {
    command,
    grid,
    invocation,
    results
};

// @ts-expect-error Comparison conditions require a comparison value.
export const missingComparisonValue: RuntimeCondition = {
    kind: "compare",
    source: { type: "formValue" },
    operator: "equals",
};

export const scriptCondition: RuntimeCondition = {
    kind: "compare",
    // @ts-expect-error Conditions cannot execute JavaScript.
    source: { type: "javascript", code: "process.exit()" },
    operator: "isEmpty",
};

// @ts-expect-error allMatching selection must preserve the query being selected.
export const missingQueryContext: GridTabSelection = {
    mode: "allMatching",
    excludedKeys: [],
};

export const wrongProviderConfig: BuiltInDataContractImplementationDefinition = {
    contractVersion: 1,
    type: "database",
    status: "active",
    // @ts-expect-error Provider kinds and config must agree.
    config: { apiDefinitionId: "api-1" },
};

export const callbackFlow: CommandDefinition = {
    version: 1,
    id: "bad",
    presentation: {},
    flow: {
        rules: [{
            id: "bad",
            actions: [{
                id: "bad",
                type: "script",
                config: {
                    // @ts-expect-error Commands cannot persist executable callbacks.
                    callback: () => 1,
                },
            }],
        }],
    },
};
