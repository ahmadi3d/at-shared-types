export const AtApiErrorCodeMap = {
    AI_SESSION_EXPIRED: 4501,
    AI_SESSION_NOT_FOUND: 4502,
    AI_REQUEST_CONTEXT_MISSING: 4503,

    ARCHIVE_INVALID_KEY: 4601,
    ARCHIVE_FILE_NOT_FOUND: 4602,
    ARCHIVE_OPERATION_NOT_SUPPORTED: 4603,
    ARCHIVE_PROVIDER_UNAVAILABLE: 4604,
    ARCHIVE_INVALID_UPLOAD: 4605,
} as const;

export type AtLegacyApiErrorCode = typeof AtApiErrorCodeMap[keyof typeof AtApiErrorCodeMap];

/** Stable semantic support code; numeric values remain supported for legacy APIs. */
export type AtApiErrorCode = string | number;

/** Versioned, value-free UI correction metadata. Diagnostic details remain separate. */
export type AtApiFieldIssueRule = 'required' | 'type' | 'min' | 'max' | 'minLength' | 'maxLength' |
    'choice' | 'cascade' | 'readOnly' | 'crossField';

export type AtApiUserIssueMessageKey = 'errors.formValidation' | 'errors.businessValidation' |
    'errors.workflowInvalidInput' | 'errors.WORKFLOW_ACCESS_DENIED' | 'errors.WORKFLOW_DRAFT_CONFLICT' |
    'errors.WORKFLOW_ASSIGNMENT_CONFLICT' | 'errors.WORKFLOW_COMMAND_IN_PROGRESS' | 'errors.WORKFLOW_SAVE_REQUIRED';

export interface AtApiFieldIssue {
    /** Published Form Maker element identity; labels are resolved by the client. */
    fieldId: string;
    /** Effective form value path, including nested Form names. */
    path: string;
    code: string;
    rule: AtApiFieldIssueRule;
    /** Only a numeric authored validation limit; never submitted values or customer labels. */
    params?: { limit: number };
}

export interface AtApiUserIssue {
    version: 1;
    code: string;
    kind: 'validation' | 'business' | 'authorization' | 'conflict';
    messageKey: AtApiUserIssueMessageKey;
    fields?: readonly AtApiFieldIssue[];
}
