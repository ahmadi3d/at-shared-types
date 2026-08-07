import type {
    CamelKeys,
    CamelKeysDeep,
    CamelStr,
    SnakeKeys,
    SnakeKeysDeep,
    SnakeStr,
} from "./case.types";


/**
 * Acronym -> normal-word boundary.
 *
 * Examples:
 *
 * APIUrl
 * -> API_Url
 *
 * RegionID
 * is handled together with WORD_BOUNDARY:
 * -> Region_ID
 */
const ACRONYM_BOUNDARY =
    /([A-Z]+)([A-Z][a-z])/g;


/**
 * Normal camelCase / PascalCase boundary.
 *
 * Examples:
 *
 * regionId
 * -> region_Id
 *
 * RegionID
 * -> Region_ID
 *
 * dataJSON
 * -> data_JSON
 */
const WORD_BOUNDARY =
    /([a-z0-9])([A-Z])/g;


/**
 * Internal canonical snake_case -> camelCase rule.
 */
const SNAKE_TO_CAMEL =
    /_+([a-zA-Z0-9])/g;


/**
 * Internal-only key transformer contract.
 */
type KeyTransformer =
    (key: string) => string;


/**
 * Normalize one supported identifier string
 * to canonical snake_case.
 *
 * This function does NOT inspect objects.
 *
 * Examples:
 *
 * RegionID
 * -> region_id
 *
 * regionID
 * -> region_id
 *
 * regionId
 * -> region_id
 *
 * region_id
 * -> region_id
 *
 * RTime
 * -> r_time
 *
 * rTime
 * -> r_time
 *
 * APIUrl
 * -> api_url
 */
export function toSnakeStr<
    S extends string
>(
    value: S
): SnakeStr<S> {
    return value
        .replace(
            ACRONYM_BOUNDARY,
            "$1_$2"
        )
        .replace(
            WORD_BOUNDARY,
            "$1_$2"
        )
        .toLowerCase() as SnakeStr<S>;
}


/**
 * Internal conversion from canonical snake_case
 * to canonical camelCase.
 *
 * This stays private because callers should use
 * toCamelStr(), which also normalizes the input first.
 */
function snakeToCamel(
    value: string
): string {
    return value.replace(
        SNAKE_TO_CAMEL,
        (
            _,
            char: string
        ) => char.toUpperCase()
    );
}


/**
 * Normalize one supported identifier string
 * to canonical camelCase.
 *
 * The input is first normalized to snake_case.
 * This means PascalCase, acronym-heavy casing,
 * normal camelCase, and snake_case all converge
 * to the same camelCase result.
 *
 * Examples:
 *
 * RegionID
 * -> region_id
 * -> regionId
 *
 * regionID
 * -> region_id
 * -> regionId
 *
 * regionId
 * -> region_id
 * -> regionId
 *
 * region_id
 * -> region_id
 * -> regionId
 *
 * RTime
 * -> r_time
 * -> rTime
 */
export function toCamelStr<
    S extends string
>(
    value: S
): CamelStr<S> {
    return snakeToCamel(
        toSnakeStr(value)
    ) as CamelStr<S>;
}


/**
 * Determine whether a value is a plain object whose
 * keys are safe to reconstruct.
 *
 * Custom class instances are deliberately excluded.
 */
function isPlainObject(
    value: unknown
): value is Record<string, unknown> {
    if (
        value === null ||
        typeof value !== "object"
    ) {
        return false;
    }

    const prototype =
        Object.getPrototypeOf(value);

    return (
        prototype === Object.prototype ||
        prototype === null
    );
}


/**
 * Values whose internal structure must never be
 * reconstructed as a normal object.
 *
 * ArrayBuffer.isView() covers:
 *
 * - Uint8Array
 * - Int32Array
 * - DataView
 * - Node.js Buffer
 * - other typed arrays
 */
function isOpaqueObject(
    value: object
): boolean {
    return (
        value instanceof Date ||
        value instanceof RegExp ||
        value instanceof Error ||
        value instanceof ArrayBuffer ||
        ArrayBuffer.isView(value)
    );
}


/**
 * Preserve the source plain object's prototype.
 *
 * This also preserves objects created using:
 *
 * Object.create(null)
 */
function createPlainObjectLike(
    source: object
): Record<string, unknown> {
    return Object.create(
        Object.getPrototypeOf(source)
    ) as Record<string, unknown>;
}


/**
 * Safely define a transformed object property.
 *
 * Object.defineProperty() is deliberately used
 * instead of:
 *
 * target[key] = value
 *
 * so keys such as "__proto__" remain ordinary
 * own properties.
 */
function defineValue(
    target: Record<string, unknown>,
    key: string,
    value: unknown
): void {
    Object.defineProperty(
        target,
        key,
        {
            value,
            enumerable: true,
            configurable: true,
            writable: true,
        }
    );
}


/**
 * Internal shallow object-key normalizer.
 *
 * Arrays are treated as transparent containers.
 *
 * Once a plain object is reached:
 *
 * - its immediate keys are normalized
 * - its values are NOT recursively normalized
 */
function transformKeysShallow(
    value: unknown,
    transformKey: KeyTransformer,
    preservedKeys: ReadonlySet<string>
): unknown {
    const seen =
        new WeakMap<object, unknown>();


    const visit = (
        current: unknown
    ): unknown => {
        if (
            current === null ||
            typeof current !== "object"
        ) {
            return current;
        }


        if (isOpaqueObject(current)) {
            return current;
        }


        if (seen.has(current)) {
            return seen.get(current);
        }


        /**
         * Arrays are containers rather than another
         * object-key depth.
         *
         * Example:
         *
         * [
         *     { RegionID: 1 },
         *     { regionId: 2 }
         * ]
         *
         * becomes:
         *
         * [
         *     { region_id: 1 },
         *     { region_id: 2 }
         * ]
         */
        if (Array.isArray(current)) {
            const output: unknown[] = [];

            seen.set(
                current,
                output
            );

            for (const item of current) {
                output.push(
                    visit(item)
                );
            }

            return output;
        }


        /**
         * Shallow normalization does not inspect:
         *
         * - Map
         * - Set
         * - custom classes
         * - URL
         * - Blob
         * - File
         * - FormData
         * - database-driver objects
         */
        if (!isPlainObject(current)) {
            return current;
        }


        const output =
            createPlainObjectLike(current);

        seen.set(
            current,
            output
        );


        for (
            const [key, item]
            of Object.entries(current)
        ) {
            const normalizedKey =
                preservedKeys.has(key)
                    ? key
                    : transformKey(key);

            /**
             * Deliberately do NOT recurse into item.
             *
             * That is what makes this operation
             * shallow.
             */
            defineValue(
                output,
                normalizedKey,
                item
            );
        }


        return output;
    };


    return visit(value);
}


/**
 * Internal recursive object-key normalizer.
 *
 * Used only by:
 *
 * - toSnakeDeep()
 * - toCamelDeep()
 *
 * It is intentionally NOT exported.
 */
function transformKeysDeep(
    value: unknown,
    transformKey: KeyTransformer,
    preservedKeys: ReadonlySet<string>
): unknown {
    const seen =
        new WeakMap<object, unknown>();


    const visit = (
        current: unknown
    ): unknown => {
        if (
            current === null ||
            typeof current !== "object"
        ) {
            return current;
        }


        if (isOpaqueObject(current)) {
            return current;
        }


        /**
         * Preserve circular/shared object references.
         */
        if (seen.has(current)) {
            return seen.get(current);
        }


        if (Array.isArray(current)) {
            const output: unknown[] = [];

            seen.set(
                current,
                output
            );

            for (const item of current) {
                output.push(
                    visit(item)
                );
            }

            return output;
        }


        /**
         * Map keys are preserved.
         *
         * They are data values rather than normal
         * JavaScript object property names.
         *
         * Map values are recursively normalized.
         */
        if (current instanceof Map) {
            const output =
                new Map<unknown, unknown>();

            seen.set(
                current,
                output
            );

            for (
                const [key, item]
                of current.entries()
            ) {
                output.set(
                    key,
                    visit(item)
                );
            }

            return output;
        }


        /**
         * Set values are recursively normalized.
         */
        if (current instanceof Set) {
            const output =
                new Set<unknown>();

            seen.set(
                current,
                output
            );

            for (
                const item
                of current.values()
            ) {
                output.add(
                    visit(item)
                );
            }

            return output;
        }


        /**
         * Preserve custom/non-plain object instances.
         */
        if (!isPlainObject(current)) {
            return current;
        }


        const output =
            createPlainObjectLike(current);

        seen.set(
            current,
            output
        );


        for (
            const [key, item]
            of Object.entries(current)
        ) {
            const normalizedKey =
                preservedKeys.has(key)
                    ? key
                    : transformKey(key);

            defineValue(
                output,
                normalizedKey,
                visit(item)
            );
        }


        return output;
    };


    return visit(value);
}


/**
 * Shallowly normalize object keys to snake_case.
 *
 * Arrays of objects are supported.
 *
 * Nested object values are NOT recursively normalized.
 *
 * Example:
 *
 * toSnake({
 *     RegionID: 1,
 *     info: {
 *         UserID: 2
 *     }
 * })
 *
 * returns:
 *
 * {
 *     region_id: 1,
 *     info: {
 *         UserID: 2
 *     }
 * }
 */
export function toSnake<
    T,
    PreservedKey extends string = never
>(
    value: T,
    preservedKeys:
        ReadonlySet<PreservedKey> =
        new Set<PreservedKey>()
): SnakeKeys<T, PreservedKey> {
    return transformKeysShallow(
        value,
        toSnakeStr,
        preservedKeys
    ) as SnakeKeys<
        T,
        PreservedKey
    >;
}


/**
 * Shallowly normalize object keys to camelCase.
 *
 * Example:
 *
 * toCamel({
 *     RegionID: 1,
 *     info: {
 *         UserID: 2
 *     }
 * })
 *
 * returns:
 *
 * {
 *     regionId: 1,
 *     info: {
 *         UserID: 2
 *     }
 * }
 */
export function toCamel<
    T,
    PreservedKey extends string = never
>(
    value: T,
    preservedKeys:
        ReadonlySet<PreservedKey> =
        new Set<PreservedKey>()
): CamelKeys<T, PreservedKey> {
    return transformKeysShallow(
        value,
        toCamelStr,
        preservedKeys
    ) as CamelKeys<
        T,
        PreservedKey
    >;
}


/**
 * Recursively normalize object keys to snake_case.
 *
 * Normally used for:
 *
 * - HTTP request payloads
 * - nested DTOs
 * - nested arrays/objects
 */
export function toSnakeDeep<
    T,
    PreservedKey extends string = never
>(
    value: T,
    preservedKeys:
        ReadonlySet<PreservedKey> =
        new Set<PreservedKey>()
): SnakeKeysDeep<T, PreservedKey> {
    return transformKeysDeep(
        value,
        toSnakeStr,
        preservedKeys
    ) as SnakeKeysDeep<
        T,
        PreservedKey
    >;
}


/**
 * Recursively normalize object keys to camelCase.
 *
 * Normally used for:
 *
 * - HTTP responses
 * - nested DTOs
 * - nested arrays/objects
 *
 * PascalCase/acronym-heavy keys are normalized too.
 *
 * Example:
 *
 * {
 *     RegionID: 1,
 *     nested_value: {
 *         UserID: 2
 *     }
 * }
 *
 * becomes:
 *
 * {
 *     regionId: 1,
 *     nestedValue: {
 *         userId: 2
 *     }
 * }
 */
export function toCamelDeep<
    T,
    PreservedKey extends string = never
>(
    value: T,
    preservedKeys:
        ReadonlySet<PreservedKey> =
        new Set<PreservedKey>()
): CamelKeysDeep<T, PreservedKey> {
    return transformKeysDeep(
        value,
        toCamelStr,
        preservedKeys
    ) as CamelKeysDeep<
        T,
        PreservedKey
    >;
}