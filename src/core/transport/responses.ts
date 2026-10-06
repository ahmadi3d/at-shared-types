import type { AtApiErrorCode } from "../protocol/errors";

export interface ResponseSuccessDto<T> {
    code: number;
    data: T;
}

export interface ResponseErrorDto {
    code: AtApiErrorCode;
    message?: string;
    details?: Record<string, unknown>;
    /** Transitional input compatibility. New backend diagnostics use details. */
    errors?: unknown[];
    timestamp: string;
}
