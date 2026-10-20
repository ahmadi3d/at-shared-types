import type { AtApplicationEvent, AtEventType } from "./domain";

const uuidPattern = "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$";
const decimalPattern = "^[1-9][0-9]{0,18}$";
const timestampPattern = "^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\\.[0-9]{3})?Z$";

const uuid = { type: "string", pattern: uuidPattern } as const;
const decimalId = { type: "string", pattern: decimalPattern } as const;
const changes = ["details", "status", "assignment", "dueTime", "seen"] as const;

function object(properties: Record<string, unknown>, required = Object.keys(properties)) {
    return { type: "object", additionalProperties: false, properties, required };
}

function eventSchema(type: AtEventType, payload: Record<string, unknown>) {
    return object({
        eventId: uuid,
        type: { const: type },
        version: { const: 1 },
        occurredAt: { type: "string", pattern: timestampPattern },
        source: { type: "string", maxLength: 100, pattern: "^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$" },
        correlationId: uuid,
        causationId: uuid,
        aggregate: object({ type: { const: "support.ticket" }, id: decimalId, revision: decimalId }, ["type", "id"]),
        payload,
    }, ["eventId", "type", "version", "occurredAt", "source", "correlationId", "aggregate", "payload"]);
}

/** Closed version registry. Adding a business fact requires a schema and an explicit consumer review. */
export const AtEventSchemas = {
    "support.ticket.created": eventSchema("support.ticket.created", object({ ticketId: decimalId })),
    "support.ticket.updated": eventSchema("support.ticket.updated", object({
        ticketId: decimalId,
        changes: { type: "array", minItems: 1, maxItems: changes.length, uniqueItems: true, items: { enum: changes } },
    })),
    "support.ticket.activity.created": eventSchema("support.ticket.activity.created", object({
        ticketId: decimalId,
        activityId: decimalId,
        visibility: { enum: ["public", "internal"] },
    })),
} as const;

export const AtApplicationEventSchema = { oneOf: Object.values(AtEventSchemas) };
export const AT_EVENT_MAX_BYTES = 8192;

export type AtEventValidation =
    | { status: "valid"; value: AtApplicationEvent }
    | { status: "invalid"; code: "EVENT_CONTRACT_INVALID" }
    | { status: "unsupported_type" | "unsupported_version" };

/** Inspect data properties before serialization: getters, cycles, prototypes and non-JSON values fail closed. */
function safeJson(value: unknown, depth: number, budget: { nodes: number; characters: number }, seen: Set<object>): boolean {
    if (--budget.nodes < 0 || depth > 8) return false;
    if (typeof value === "string") {
        budget.characters -= value.length;
        return budget.characters >= 0;
    }
    if (value === null || typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value !== "object" || seen.has(value)) return false;
    if (Array.isArray(value)) {
        if (Object.getPrototypeOf(value) !== Array.prototype || value.length > 32) return false;
    } else if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return false;
    seen.add(value);
    const keys = Reflect.ownKeys(value);
    if (Array.isArray(value) && (keys.length !== value.length + 1
        || !keys.every(key => key === "length" || (typeof key === "string" && /^(0|[1-9][0-9]*)$/.test(key))))) return false;
    const valid = keys.every(key => {
        if (Array.isArray(value) && key === "length") return true;
        if (typeof key !== "string" || ["__proto__", "constructor", "prototype", "toJSON"].includes(key)) return false;
        budget.characters -= key.length;
        if (budget.characters < 0) return false;
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        return !!descriptor && descriptor.enumerable === true && "value" in descriptor
            && safeJson(descriptor.value, depth + 1, budget, seen);
    });
    seen.delete(value);
    return valid;
}

function record(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function keys(value: Record<string, unknown>, required: string[], optional: string[] = []): boolean {
    return required.every(key => Object.prototype.hasOwnProperty.call(value, key))
        && Object.keys(value).every(key => required.includes(key) || optional.includes(key));
}

function decimal(value: unknown): value is string {
    return typeof value === "string" && new RegExp(decimalPattern).test(value) && BigInt(value) <= 9223372036854775807n;
}

function isUuid(value: unknown): value is string {
    return typeof value === "string" && new RegExp(uuidPattern).test(value);
}

function isTimestamp(value: unknown): boolean {
    if (typeof value !== "string" || !new RegExp(timestampPattern).test(value)) return false;
    const time = Date.parse(value);
    return Number.isFinite(time) && new Date(time).toISOString() === (value.length === 20 ? value.slice(0, -1) + ".000Z" : value);
}

/** Portable validation includes cross-field checks that a structural JSON schema cannot express. */
export function validateAtEvent(input: unknown): AtEventValidation {
    const invalid = { status: "invalid", code: "EVENT_CONTRACT_INVALID" } as const;
    try {
        if (!safeJson(input, 0, { nodes: 128, characters: AT_EVENT_MAX_BYTES }, new Set()) || !record(input)) return invalid;
        // Bound the encoded envelope as well as individual strings (including multibyte text).
        if (new TextEncoder().encode(JSON.stringify(input)).byteLength > AT_EVENT_MAX_BYTES) return invalid;
        if (!keys(input, ["eventId", "type", "version", "occurredAt", "source", "correlationId", "aggregate", "payload"], ["causationId"]))
            return invalid;
        if (typeof input.type !== "string" || !Object.prototype.hasOwnProperty.call(AtEventSchemas, input.type))
            return { status: "unsupported_type" };
        if (input.version !== 1) return { status: "unsupported_version" };
        if (!isUuid(input.eventId) || !isUuid(input.correlationId) || !isTimestamp(input.occurredAt)) return invalid;
        if ("causationId" in input && !isUuid(input.causationId)) return invalid;
        if (typeof input.source !== "string" || input.source.length > 100 || !/^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/.test(input.source))
            return invalid;
        const aggregate = input.aggregate;
        if (!record(aggregate) || !keys(aggregate, ["type", "id"], ["revision"]) || aggregate.type !== "support.ticket"
            || !decimal(aggregate.id) || ("revision" in aggregate && !decimal(aggregate.revision))) return invalid;
        const payload = input.payload;
        if (!record(payload) || !decimal(payload.ticketId) || aggregate.id !== payload.ticketId) return invalid;
        switch (input.type) {
            case "support.ticket.created":
                if (!keys(payload, ["ticketId"])) return invalid;
                break;
            case "support.ticket.updated":
                if (!keys(payload, ["ticketId", "changes"]) || !Array.isArray(payload.changes)
                    || payload.changes.length < 1 || payload.changes.length > changes.length
                    || new Set(payload.changes).size !== payload.changes.length
                    || !payload.changes.every(change => changes.includes(change as typeof changes[number]))) return invalid;
                break;
            case "support.ticket.activity.created":
                if (!keys(payload, ["ticketId", "activityId", "visibility"]) || !decimal(payload.activityId)
                    || !["public", "internal"].includes(String(payload.visibility))) return invalid;
                break;
        }
        // Return a detached validated value so later caller mutation cannot change the accepted event.
        return { status: "valid", value: JSON.parse(JSON.stringify(input)) as AtApplicationEvent };
    } catch {
        return invalid;
    }
}
