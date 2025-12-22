export const ATAPIErrorCodeDTO = {
    // 45xx – AI / workflow
    AI_SESSION_EXPIRED: 4501,
    AI_SESSION_NOT_FOUND: 4502,
} as const;

export type ATAPIErrorCodeDTO = typeof ATAPIErrorCodeDTO[keyof typeof ATAPIErrorCodeDTO];