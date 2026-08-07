import type {
    CamelKeys,
    CamelKeysDeep,
    CamelStr,
    SnakeKeys,
    SnakeKeysDeep,
    SnakeStr,
} from "./case.types";


/**
 * Acronym-to-word boundary.
 *
 * Examples:
 *
 * APIUrl
 *   ↓
 * API_Url
 *
 * JSONData
 *   ↓
 * JSON_Data
 */
const ACRONYM_BOUNDARY =
    /([A-Z]+)([A-Z][a-z])/g;


/**
 * Normal camelCase/PascalCase word boundary.
 *
 * Examples:
 *
 * userId
 *   ↓
 * user_Id
 *
 * RegionId
 *   ↓
 * Region_Id
 */
const WORD_BOUNDARY =
    /([a-z0-9])([A-Z])/g;


/**
 * snake_case separator followed by the character
 * that should become uppercase.
 */
const SNAKE_TO_CAMEL =
    /_+([a-zA-Z0-9])/g;


/**
 * Internal-only key transformer contract.
 */
type KeyTransformer =
    (key: string) => string;


/**
 * Convert one string identifier to snake_case.
 *
 * This does NOT inspect objects.
 *
 * Examples:
 *
 * userId
 * -> user_id
 *
 * RegionID
 * -> region_id
 *
 * RTime
 * -> r_time
 *
 * APIUrl
 * -> api_url
 *
 * resultSetsObj
 * -> result_sets_obj
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
 * Convert one snake_case string identifier
 * to camelCase.
 *
 * This does NOT inspect objects.
 *
 * Examples:
 *
 * user_id
 * -> userId
 *
 * r_time
 * -> rTime
 *
 * result_sets_obj
 * -> resultSetsObj
 */
export function toCamelStr<
    S extends string
>(
    value: S
): CamelStr<S> {
    return value.replace(
        SNAKE_TO_CAMEL,
        (
            _,
            char: string
        ) => char.toUpperCase()
    ) as CamelStr<S>;
}


/**
 * Determine whether a value is a plain object
 * whose keys are safe to reconstruct.
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
 * Values whose internal structure must never
 * be reconstructed as a normal object.
 *
 * ArrayBuffer.isView() also covers:
 *
 * - Uint8Array
 * - Int32Array
 * - DataView
 * - Node.js Buffer
 * - etc.
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
 * Preserve the source object's plain-object prototype.
 *
 * This matters for objects created with:
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
 * defineProperty is used instead of:
 *
 * target[key] = value
 *
 * so special names such as "__proto__" are treated
 * as ordinary own properties.
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
 * Internal shallow key transformer.
 *
 * Arrays are traversed because arrays are containers,
 * not an object-key depth.
 *
 * Once a plain object is reached:
 *
 * - its immediate keys are converted
 * - its values are NOT recursively converted
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
         * Arrays are transparent containers for
         * shallow conversion.
         *
         * Example:
         *
         * [
         *   { userId: 1 },
         *   { userId: 2 }
         * ]
         *
         * becomes:
         *
         * [
         *   { user_id: 1 },
         *   { user_id: 2 }
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
         * Map, Set, custom classes, URL, Blob,
         * File, database-driver objects, etc.
         *
         * Shallow conversion does not inspect them.
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
            const nextKey =
                preservedKeys.has(key)
                    ? key
                    : transformKey(key);

            /**
             * IMPORTANT:
             *
             * item is deliberately NOT passed
             * through visit().
             *
             * This is what makes this function
             * shallow.
             */
            defineValue(
                output,
                nextKey,
                item
            );
        }


        return output;
    };


    return visit(value);
}


/**
 * Internal recursive key transformer.
 *
 * This is the engine used by:
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
         * Handles circular references and preserves
         * shared references.
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
         * Map keys are preserved deliberately.
         *
         * Map keys are data, not JavaScript
         * property names.
         *
         * Map values are recursively converted.
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
         * Set items are values, so nested object
         * values inside a Set are recursively handled.
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
         * Do not destroy custom object types.
         *
         * Examples:
         *
         * URL
         * File
         * Blob
         * FormData
         * database-driver classes
         * custom class instances
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
            const nextKey =
                preservedKeys.has(key)
                    ? key
                    : transformKey(key);

            defineValue(
                output,
                nextKey,
                visit(item)
            );
        }


        return output;
    };


    return visit(value);
}


/**
 * Shallowly convert object keys to snake_case.
 *
 * Arrays of objects are supported.
 *
 * Nested object values are NOT converted.
 *
 * Example:
 *
 * toSnake({
 *     userId: 1,
 *     info: {
 *         regionId: 2
 *     }
 * })
 *
 * returns:
 *
 * {
 *     user_id: 1,
 *     info: {
 *         regionId: 2
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
 * Shallowly convert object keys to camelCase.
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
 * Recursively convert object keys to snake_case.
 *
 * This is normally what you want for:
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
 * Recursively convert object keys to camelCase.
 *
 * This is normally what you want for:
 *
 * - HTTP responses
 * - nested DTOs
 * - nested arrays/objects
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