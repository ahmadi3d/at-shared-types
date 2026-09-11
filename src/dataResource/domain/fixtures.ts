import type { DataTransform, DataTransformDraft } from "../../dataSource/domain/transform";
import type { RuntimeValueBinding, RuntimeValueExpression, RuntimeValueExpressionDraft } from "../../runtime/domain";
import type { DataGraph } from "./graph";
import type { DataResourceReference } from "./reference";
import type { SourceDataResource } from "./resource";

const emptyGraph: DataGraph = {
    version: 1,
    resources: {},
};

const customers: SourceDataResource = {
    id: "customers",
    name: "Customers",
    kind: "source",
    execution: "reactive",
    dataSource: {
        version: 1,
        source: {
            type: "database",
            config: {
                database: "app",
                schema: "dbo",
                objectName: "GetCustomers",
                objectType: "procedure",
            },
        },
    },
};

const orders: SourceDataResource = {
    id: "orders",
    name: "Orders",
    kind: "source",
    execution: "reactive",
    dataSource: {
        version: 1,
        source: {
            type: "database",
            config: {
                database: "app",
                schema: "dbo",
                objectName: "GetOrders",
                objectType: "procedure",
            },
        },
    },
};

const monthlyReport: SourceDataResource = {
    id: "monthlyReport",
    name: "Monthly Report",
    kind: "source",
    execution: "onDemand",
    dataSource: {
        version: 1,
        source: {
            type: "database",
            config: {
                database: "reporting",
                schema: "dbo",
                objectName: "BuildMonthlyReport",
                objectType: "procedure",
            },
        },
        inputs: {
            month: {
                type: "formValue",
                path: "filters.month",
            },
        },
    },
};

const customerOrdersExpression: RuntimeValueExpression = {
    type: "resource",
    resourceId: "customers",
    path: "items",
};

const resourceExpressionDraft: RuntimeValueExpressionDraft = {
    type: "resource",
};

const monthlyReportReference: DataResourceReference = {
    resourceId: "monthlyReport",
};

const customerSummaryTransform: DataTransform = {
    version: 1,
    steps: [
        {
            id: "summary-customers",
            type: "selectPath",
            config: {
                path: "customers",
            },
        },
    ],
};

const applyNestedTransform: DataTransform = {
    version: 1,
    steps: [
        {
            id: "apply-orders",
            type: "apply",
            config: {
                scope: "items",
                path: "orders",
                transform: {
                    version: 1,
                    steps: [
                        {
                            id: "limit-orders",
                            type: "limit",
                            config: {
                                count: 5,
                            },
                        },
                    ],
                },
            },
        },
    ],
};

const incompleteNestedApplyDraft: DataTransformDraft = {
    version: 1,
    steps: [
        {
            id: "draft-apply",
            type: "apply",
            config: {
                scope: "value",
                transform: {
                    version: 1,
                    steps: [
                        {
                            id: "draft-limit",
                            type: "limit",
                            config: {},
                        },
                    ],
                },
            },
        },
    ],
};

const parseJsonTransform: DataTransform = {
    version: 1,
    steps: [
        {
            id: "parse-json",
            type: "parseJson",
            config: {},
        },
    ],
};

const gridBinding: RuntimeValueBinding = {
    version: 1,
    value: {
        type: "resource",
        resourceId: "customers",
    },
};

const comboBoxBinding: RuntimeValueBinding = {
    version: 1,
    value: {
        type: "resource",
        resourceId: "customers",
    },
    transform: {
        version: 1,
        steps: [
            {
                id: "combo-options",
                type: "selectPath",
                config: {
                    path: "items",
                },
            },
        ],
    },
};

const labelBinding: RuntimeValueBinding = {
    version: 1,
    value: {
        type: "resource",
        resourceId: "customers",
    },
    transform: {
        version: 1,
        steps: [
            {
                id: "label-count",
                type: "selectPath",
                config: {
                    path: "totalCount",
                },
            },
        ],
    },
};

const dataContractResource: SourceDataResource = {
    id: "customerSearch",
    name: "Customer Search",
    kind: "source",
    execution: "reactive",
    dataSource: {
        version: 1,
        source: {
            type: "dataContract",
            config: {
                dataContractId: "customer-search",
                version: 1,
            },
        },
    },
};

const populatedGraph: DataGraph = {
    version: 1,
    resources: {
        customers,
        orders,
        monthlyReport,
        customerSummary: {
            id: "customerSummary",
            name: "Customer Summary",
            kind: "computed",
            execution: "reactive",
            inputs: {
                customers: {
                    type: "resource",
                    resourceId: "customers",
                },
                orders: {
                    type: "resource",
                    resourceId: "orders",
                },
            },
            transform: customerSummaryTransform,
        },
        customerSearch: dataContractResource,
    },
};

const serializedGraph = JSON.stringify(populatedGraph);
const roundTrippedGraph = JSON.parse(serializedGraph) as DataGraph;

void [
    emptyGraph,
    customerOrdersExpression,
    resourceExpressionDraft,
    monthlyReportReference,
    applyNestedTransform,
    incompleteNestedApplyDraft,
    parseJsonTransform,
    gridBinding,
    comboBoxBinding,
    labelBinding,
    roundTrippedGraph,
];

export {};
