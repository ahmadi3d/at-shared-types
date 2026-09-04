/**
 * Escape-hatch transform for transformations that cannot be represented by
 * the visual/declarative step types.
 *
 * The at-platform runtime owns the execution contract and sandboxing policy.
 * This DTO intentionally stores only the script source.
 */
export interface JavascriptTransformConfig {
    code: string;
}
