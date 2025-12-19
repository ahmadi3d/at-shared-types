export interface ResponseSuccessDTO<T> {
    code: number;
    data: T;
}

export interface ResponseErrorDTO {
    code: number;
    message: string;
    errors?: any[],
    timestamp: string,
}