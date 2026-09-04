/**
 * Selects a nested value from the current transform value.
 *
 * This is especially useful for API responses such as:
 * `{ data: { items: [...] } }` where subsequent steps should operate on
 * `data.items`.
 */
export interface SelectPathTransformConfig {
    path: string;
}
