/**
 * Parses the current string value as JSON.
 *
 * The step has no persisted options. A serializable empty-object contract is
 * used instead of `any` so authored transform JSON remains explicit.
 */
export type ParseJsonTransformConfig = Record<string, never>;
