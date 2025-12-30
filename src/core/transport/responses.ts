import type { ATAPIErrorCode } from "../protocol/errors";

export interface ResponseSuccessDTO<T> {
    code: number;
    data: T;
}

export interface ResponseErrorDTO {
    code: ATAPIErrorCode;
    message: string;
    errors?: any[];
    timestamp: string;
}