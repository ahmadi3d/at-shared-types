export interface LimitTransformConfig {
    /**
     * Number of array items to keep.
     */
    count: number;

    /**
     * Number of items to skip before applying the limit.
     */
    offset?: number;
}
