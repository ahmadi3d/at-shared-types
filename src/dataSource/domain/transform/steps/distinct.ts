import type { DataTransformExpression } from "../expression";

export interface DistinctTransformConfig {
    /**
     * Expressions whose evaluated values form the distinct key.
     *
     * When omitted or empty, the runtime may compare the entire item/value.
     */
    by?: DataTransformExpression[];
}
