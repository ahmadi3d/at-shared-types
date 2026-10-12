/** A bounded draft design; native catalogs and publication establish authority and frozen versions. */
export interface AiBpmnStep {
    id: string;
    name: string;
    kind: "start" | "end" | "user-task" | "automation" | "exclusive-gateway" | "parallel-gateway";
    /** Native V4 TaskData or V2 AutomationData JSON. Other step kinds require null. */
    definitionJson: string | null;
    /** Exact published form version observed in the authorized catalog, not a model-owned version. */
    formVersionId: number | null;
}
export interface AiBpmnTransition {
    id: string;
    sourceId: string;
    targetId: string;
    name: string;
    /** Closed native atContext expression; never arbitrary EL or JavaScript. */
    condition: string | null;
    defaultRoute: boolean;
}
export interface AiBpmnSpecification {
    schemaVersion: 1;
    title: string;
    description: string;
    metadataJson: string | null;
    steps: AiBpmnStep[];
    transitions: AiBpmnTransition[];
}
