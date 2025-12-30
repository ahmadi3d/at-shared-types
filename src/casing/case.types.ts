type FixAcronyms<S extends string> =
    S extends `${infer A}ID${infer B}` ? FixAcronyms<`${A}Id${B}`> : S;

export type SnakeCase<S extends string> =
    S extends `${infer H}${infer T}`
    ? T extends Uncapitalize<T>
    ? `${Lowercase<H>}${SnakeCase<T>}`
    : `${Lowercase<H>}_${SnakeCase<Uncapitalize<T>>}`
    : S;

export type CamelCase<S extends string> =
    S extends `${infer A}_${infer B}`
    ? `${A}${Capitalize<CamelCase<B>>}`
    : S;

type Primitive = string | number | boolean | bigint | symbol | null | undefined;
type Builtin = Primitive | Date | RegExp | Error;

export type DeepSnakeKeys<T> =
    T extends Builtin ? T :
    T extends (...args: any[]) => any ? T :
    T extends readonly [any, ...any[]]
    ? { [I in keyof T]: DeepSnakeKeys<T[I]> } :
    T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepSnakeKeys<U>> :
    T extends Map<infer K, infer V>
    ? Map<DeepSnakeKeys<K>, DeepSnakeKeys<V>> :
    T extends Set<infer U>
    ? Set<DeepSnakeKeys<U>> :
    T extends object
    ? {
        [K in keyof T as K extends string
        ? SnakeCase<FixAcronyms<K>>
        : K
        ]: DeepSnakeKeys<T[K]>
    }
    : T;

export type DeepCamelKeys<T> =
    T extends Builtin ? T :
    T extends (...args: any[]) => any ? T :
    T extends readonly [any, ...any[]]
    ? { [I in keyof T]: DeepCamelKeys<T[I]> } :
    T extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepCamelKeys<U>> :
    T extends Map<infer K, infer V>
    ? Map<DeepCamelKeys<K>, DeepCamelKeys<V>> :
    T extends Set<infer U>
    ? Set<DeepCamelKeys<U>> :
    T extends object
    ? { [K in keyof T as K extends string ? CamelCase<K> : K]: DeepCamelKeys<T[K]> }
    : T;
