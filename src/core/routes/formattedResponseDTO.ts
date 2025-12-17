export interface FormattedResponseInterfaceDTO<T> {
    //If you do not provide a code it uses the status code but if you do you may send your own custom code.
    code?: number;
    message?: string;
    data?: T;
    errors?: any[],
    timestamp?: string,
}
