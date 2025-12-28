const CAMEL_TO_SNAKE = /[A-Z]/g;
const SNAKE_TO_CAMEL = /_([a-z])/g;

export const toSnakeKey = (k: string) =>
    k.replace(CAMEL_TO_SNAKE, m => `_${m.toLowerCase()}`);

export const toCamelKey = (k: string) =>
    k.replace(SNAKE_TO_CAMEL, (_, c) => c.toUpperCase());

export function toSnakeDeep<T>(value: T, exceptions = new Set<string>()): any {
    if (Array.isArray(value)) return value.map(v => toSnakeDeep(v, exceptions));
    if (value instanceof Date) return value;
    if (value && typeof value === "object") {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value as any)) {
            const nk = exceptions.has(k) ? k : toSnakeKey(k);
            out[nk] = toSnakeDeep(v, exceptions);
        }
        return out;
    }
    return value;
}

export function toCamelDeep<T>(value: T): any {
    if (Array.isArray(value)) return value.map(toCamelDeep);
    if (value instanceof Date) return value;
    if (value && typeof value === "object") {
        const out: Record<string, any> = {};
        for (const [k, v] of Object.entries(value as any)) {
            out[toCamelKey(k)] = toCamelDeep(v);
        }
        return out;
    }
    return value;
}
