/** A native BPMN condition expression; Flowable evaluates it. */
export type WorkflowConditionExpression = string;

export type WorkflowRouteOperator = "==" | "!=" | ">" | ">=" | "<" | "<=";
export type WorkflowRouteValue = string | number | boolean | null;
export type WorkflowRouteCondition = {
    kind: "comparison";
    path: string;
    operator: WorkflowRouteOperator;
    value: WorkflowRouteValue;
} | {
    kind: "group";
    operator: "&&" | "||";
    conditions: WorkflowRouteCondition[];
};
