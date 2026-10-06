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
