/**
 * Internal helper:
 * determines whether a character is an uppercase letter.
 */
type IsUpperAlpha<C extends string> =
    C extends Uppercase<C>
    ? C extends Lowercase<C>
    ? false
    : true
    : false;


/**
 * Internal helper:
 * determines whether a character is a lowercase letter.
 */
type IsLowerAlpha<C extends string> =
    C extends Lowercase<C>
    ? C extends Uppercase<C>
    ? false
    : true
    : false;


/**
 * Internal helper:
 * determines whether "_" should be inserted before
 * the current character when converting to snake_case.
 */
type NeedsSnakeBoundary<
    Prev extends string,
    Current extends string,
    Next extends string
> =
    Prev extends "" | "_"
    ? false
    : IsUpperAlpha<Current> extends true
    ? IsUpperAlpha<Prev> extends true
    ? IsLowerAlpha<Next> extends true
    ? true
    : false
    : true
    : false;


/**
 * Internal snake_case string implementation.
 */
type SnakeStrImpl<
    S extends string,
    Prev extends string = ""
> =
    S extends `${infer Current}${infer Rest}`
    ? Rest extends `${infer Next}${infer _Tail}`
    ? `${NeedsSnakeBoundary<
        Prev,
        Current,
        Next
    > extends true
    ? "_"
    : ""
    }${Lowercase<Current>}${SnakeStrImpl<
        Rest,
        Current
    >}`
    : `${NeedsSnakeBoundary<
        Prev,
        Current,
        ""
    > extends true
    ? "_"
    : ""
    }${Lowercase<Current>}`
    : "";


/**
 * Convert a string-literal type to snake_case.
 *
 * Examples:
 *
 * SnakeStr<"userId">
 * // "user_id"
 *
 * SnakeStr<"RegionID">
 * // "region_id"
 *
 * SnakeStr<"RTime">
 * // "r_time"
 *
 * SnakeStr<"APIUrl">
 * // "api_url"
 */
export type SnakeStr<
    S extends string
> = SnakeStrImpl<S>;


/**
 * Internal camelCase string implementation.
 */
type CamelStrImpl<S extends string> =
    S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<
        CamelStrImpl<Tail>
    >}`
    : S;


/**
 * Convert a snake_case string-literal type
 * to camelCase.
 *
 * Examples:
 *
 * CamelStr<"user_id">
 * // "userId"
 *
 * CamelStr<"r_time">
 * // "rTime"
 *
 * CamelStr<"result_sets_obj">
 * // "resultSetsObj"
 */
export type CamelStr<
    S extends string
> = CamelStrImpl<S>;


/**
 * Values that should never have their internal
 * structure inspected by casing utilities.
 */
type Primitive =
    | string
    | number
    | boolean
    | bigint
    | symbol
    | null
    | undefined;


type Builtin =
    | Primitive
    | Date
    | RegExp
    | Error
    | ArrayBuffer
    | ArrayBufferView;


type AnyFunction =
    (...args: any[]) => any;


/**
 * Internal shallow snake_case object mapping.
 *
 * Only immediate object keys are transformed.
 * Values are left unchanged.
 */
type SnakeObjectKeys<
    T,
    PreservedKey extends string
> = {
        [K in keyof T as
        K extends string
        ? K extends PreservedKey
        ? K
        : SnakeStr<K>
        : K
        ]: T[K];
    };


/**
 * Internal shallow camelCase object mapping.
 */
type CamelObjectKeys<
    T,
    PreservedKey extends string
> = {
        [K in keyof T as
        K extends string
        ? K extends PreservedKey
        ? K
        : CamelStr<K>
        : K
        ]: T[K];
    };


/**
 * Shallowly convert object keys to snake_case.
 *
 * Arrays are treated as containers, so an array
 * of objects has each object's immediate keys
 * converted.
 *
 * Nested object values are NOT recursively converted.
 *
 * Example:
 *
 * SnakeKeys<{
 *     userId: number;
 *     info: {
 *         regionId: number;
 *     };
 * }>
 *
 * becomes:
 *
 * {
 *     user_id: number;
 *     info: {
 *         regionId: number;
 *     };
 * }
 */
export type SnakeKeys<
    T,
    PreservedKey extends string = never
> =
    T extends Builtin
    ? T
    : T extends AnyFunction
    ? T
    : T extends readonly unknown[]
    ? {
        [I in keyof T]:
        SnakeKeys<
            T[I],
            PreservedKey
        >
    }
    : T extends ReadonlyMap<
        any,
        any
    >
    ? T
    : T extends ReadonlySet<any>
    ? T
    : T extends object
    ? SnakeObjectKeys<
        T,
        PreservedKey
    >
    : T;


/**
 * Shallowly convert object keys to camelCase.
 */
export type CamelKeys<
    T,
    PreservedKey extends string = never
> =
    T extends Builtin
    ? T
    : T extends AnyFunction
    ? T
    : T extends readonly unknown[]
    ? {
        [I in keyof T]:
        CamelKeys<
            T[I],
            PreservedKey
        >
    }
    : T extends ReadonlyMap<
        any,
        any
    >
    ? T
    : T extends ReadonlySet<any>
    ? T
    : T extends object
    ? CamelObjectKeys<
        T,
        PreservedKey
    >
    : T;


/**
 * Recursively convert object keys to snake_case.
 *
 * - arrays are traversed
 * - nested objects are traversed
 * - Map keys are preserved
 * - Map values are traversed
 * - Set values are traversed
 * - built-in/opaque values are preserved
 */
export type SnakeKeysDeep<
    T,
    PreservedKey extends string = never
> =
    T extends Builtin
    ? T
    : T extends AnyFunction
    ? T
    : T extends readonly unknown[]
    ? {
        [I in keyof T]:
        SnakeKeysDeep<
            T[I],
            PreservedKey
        >
    }
    : T extends Map<
        infer K,
        infer V
    >
    ? Map<
        K,
        SnakeKeysDeep<
            V,
            PreservedKey
        >
    >
    : T extends ReadonlyMap<
        infer K,
        infer V
    >
    ? ReadonlyMap<
        K,
        SnakeKeysDeep<
            V,
            PreservedKey
        >
    >
    : T extends Set<
        infer U
    >
    ? Set<
        SnakeKeysDeep<
            U,
            PreservedKey
        >
    >
    : T extends ReadonlySet<
        infer U
    >
    ? ReadonlySet<
        SnakeKeysDeep<
            U,
            PreservedKey
        >
    >
    : T extends object
    ? {
        [K in keyof T as
        K extends string
        ? K extends PreservedKey
        ? K
        : SnakeStr<K>
        : K
        ]:
        SnakeKeysDeep<
            T[K],
            PreservedKey
        >
    }
    : T;


/**
 * Recursively convert object keys to camelCase.
 */
export type CamelKeysDeep<
    T,
    PreservedKey extends string = never
> =
    T extends Builtin
    ? T
    : T extends AnyFunction
    ? T
    : T extends readonly unknown[]
    ? {
        [I in keyof T]:
        CamelKeysDeep<
            T[I],
            PreservedKey
        >
    }
    : T extends Map<
        infer K,
        infer V
    >
    ? Map<
        K,
        CamelKeysDeep<
            V,
            PreservedKey
        >
    >
    : T extends ReadonlyMap<
        infer K,
        infer V
    >
    ? ReadonlyMap<
        K,
        CamelKeysDeep<
            V,
            PreservedKey
        >
    >
    : T extends Set<
        infer U
    >
    ? Set<
        CamelKeysDeep<
            U,
            PreservedKey
        >
    >
    : T extends ReadonlySet<
        infer U
    >
    ? ReadonlySet<
        CamelKeysDeep<
            U,
            PreservedKey
        >
    >
    : T extends object
    ? {
        [K in keyof T as
        K extends string
        ? K extends PreservedKey
        ? K
        : CamelStr<K>
        : K
        ]:
        CamelKeysDeep<
            T[K],
            PreservedKey
        >
    }
    : T;