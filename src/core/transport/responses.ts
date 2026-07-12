import type { AtApiErrorCode } from "../protocol/errors";

export interface ResponseSuccessDto<T> {
    code: number;
    data: T;
}

export interface ResponseErrorDto {
    code: AtApiErrorCode;
    message: string;
    errors?: any[];
    timestamp: string;
}