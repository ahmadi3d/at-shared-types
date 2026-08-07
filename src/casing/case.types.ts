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
 * the current character when normalizing to snake_case.
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
 * Internal snake_case normalization implementation.
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
 * Normalize a supported identifier string to snake_case.
 *
 * Examples:
 *
 * SnakeStr<"regionId">
 * // "region_id"
 *
 * SnakeStr<"RegionID">
 * // "region_id"
 *
 * SnakeStr<"regionID">
 * // "region_id"
 *
 * SnakeStr<"region_id">
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
 * Internal snake_case -> camelCase implementation.
 *
 * Input to this helper is assumed to already be
 * normalized snake_case.
 */
type CamelFromSnake<S extends string> =
    S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<
        CamelFromSnake<Tail>
    >}`
    : S;


/**
 * Normalize a supported identifier string to camelCase.
 *
 * The type first normalizes to snake_case and then
 * converts that canonical representation to camelCase.
 *
 * Examples:
 *
 * CamelStr<"regionId">
 * // "regionId"
 *
 * CamelStr<"RegionID">
 * // "regionId"
 *
 * CamelStr<"regionID">
 * // "regionId"
 *
 * CamelStr<"region_id">
 * // "regionId"
 *
 * CamelStr<"RTime">
 * // "rTime"
 *
 * CamelStr<"r_time">
 * // "rTime"
 */
export type CamelStr<
    S extends string
> = CamelFromSnake<
    SnakeStr<S>
>;


/**
 * Values that casing utilities should treat as values,
 * rather than attempting to inspect as ordinary objects.
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
 * Only immediate object keys are normalized.
 * Values themselves are left unchanged.
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
 * Shallowly normalize object keys to snake_case.
 *
 * Arrays are treated as containers, so an array of
 * objects has each object's immediate keys normalized.
 *
 * Nested object values are NOT recursively normalized.
 *
 * Example:
 *
 * SnakeKeys<{
 *     RegionID: number;
 *     info: {
 *         UserID: number;
 *     };
 * }>
 *
 * becomes:
 *
 * {
 *     region_id: number;
 *     info: {
 *         UserID: number;
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
    : T extends ReadonlyMap<any, any>
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
 * Shallowly normalize object keys to camelCase.
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
    : T extends ReadonlyMap<any, any>
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
 * Recursively normalize object keys to snake_case.
 *
 * Behavior:
 *
 * - arrays are traversed
 * - nested plain objects are traversed
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
 * Recursively normalize object keys to camelCase.
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