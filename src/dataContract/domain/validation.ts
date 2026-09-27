/** Whether validation failed before or after executing an implementation. */
export type DataContractValidationPhase = "input" | "output";

/** Stable validation categories suitable for UI and API error handling. */
export type DataContractValidationIssueCode =
    | "required"
    | "type"
    | "enum"
    | "format"
    | "additional-property"
    | "invalid";

/**
 * One schema-validation issue.
 *
 * `path` is structural rather than presentation-specific, for example
 * `["customer", "email"]` or `["items", 0, "price"]`.
 */
export interface DataContractValidationIssue {
    path: Array<string | number>;
    code: DataContractValidationIssueCode;
    message: string;
    expected?: string;
    received?: string;
}

/** Serializable validation failure returned by the Data Contract runtime. */
export interface DataContractValidationFailure {
    phase: DataContractValidationPhase;
    issues: DataContractValidationIssue[];
}
