import type { AtApiErrorCode, AtApiUserIssue } from "../protocol/errors";

export interface ResponseSuccessDto<T> {
    code: number;
    data: T;
}

export interface ResponseErrorDto {
    code: AtApiErrorCode;
    message?: string;
    /** Safe correction metadata is available even when diagnostic exposure is disabled. */
    issue?: AtApiUserIssue;
    details?: Record<string, unknown>;
    /** Transitional input compatibility. New backend diagnostics use details. */
    errors?: unknown[];
    timestamp: string;
}
