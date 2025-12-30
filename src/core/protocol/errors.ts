export const ATAPIErrorCodeMap = {
    AI_SESSION_EXPIRED: 4501,
    AI_SESSION_NOT_FOUND: 4502,
    AI_REQUEST_CONTEXT_MISSING: 4503,
} as const;

export type ATAPIErrorCode = typeof ATAPIErrorCodeMap[keyof typeof ATAPIErrorCodeMap];
