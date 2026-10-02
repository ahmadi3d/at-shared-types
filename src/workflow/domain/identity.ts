/** Stable semantic key, never a local role numeric ID. */
export type WorkflowRoleGroupId = `role:${string}`;
/** SQL GUID-derived immutable model identity; preserve frozen casing. */
export type WorkflowEngineKey = string;
export type WorkflowCorrelationId = string;
export type WorkflowPublicationCorrelationId = string;
export interface WorkflowDurablePublicationIdentity {
    engineKey: WorkflowEngineKey;
    publicationCorrelationId: WorkflowPublicationCorrelationId;
    /** Flowable definition identifier is opaque (Flowable 8 may return a UUID). */
    flowableProcessDefinitionId: string;
    processDefinitionKey: string;
}
export type WorkflowStartScopePolicy = "CUSTOMER_OWNER" | "EXPLICIT_TELECOM_UNIT" | "GLOBAL";
