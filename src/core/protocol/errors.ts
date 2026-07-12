export const AtApiErrorCodeMap = {
    AI_SESSION_EXPIRED: 4501,
    AI_SESSION_NOT_FOUND: 4502,
    AI_REQUEST_CONTEXT_MISSING: 4503,
} as const;

export type AtApiErrorCode = typeof AtApiErrorCodeMap[keyof typeof AtApiErrorCodeMap];
