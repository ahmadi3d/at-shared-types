import type { AtJsonObject } from "../../core/domain/json.types";
import type { AiValidationIssueDto } from "../domain/platform";
import type { AiJsonSchema } from "./platform-schemas";

export type AiProtocolValidation<T> =
    | { status: "valid"; value: T }
    | { status: "invalid"; issues: AiValidationIssueDto[] }
    | { status: "unsupported_version" | "migration_required"; schemaId: string; schemaVersion: number };

export interface AiPayloadRegistry {
    /** Artifact metadata uses ai.tool.<toolId> and ai.card.<cardType>; data uses its domain schemaId. */
    resolve(schemaId: string, schemaVersion: number):
        | { status: "supported"; validate(payload: AtJsonObject): boolean }
        | { status: "unsupported_version" | "migration_required" };
}

const record = (value: unknown): value is Record<string, unknown> =>
    !!value && typeof value === "object" && !Array.isArray(value);
const invalid = (path: string, code: string): AiProtocolValidation<never> => ({
    status: "invalid", issues: [{ path, code, message: "AI protocol data is invalid." }],
});

function boundedJson(value: unknown, depth: number, remaining: { nodes: number; characters: number }, seen: Set<object>): boolean {
    if (--remaining.nodes < 0 || depth > 16) return false;
    if (typeof value === "string") {
        remaining.characters -= value.length;
        return remaining.characters >= 0;
    }
    if (value === null || typeof value === "boolean") return true;
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value !== "object" || seen.has(value)) return false;
    if (Array.isArray(value) && value.length > 4096) return false;
    if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return false;
    seen.add(value);
    const names = Object.keys(value);
    const valid = names.every(name => {
        if (["__proto__", "prototype", "constructor"].includes(name)) return false;
        remaining.characters -= name.length;
        if (remaining.characters < 0) return false;
        const descriptor = Object.getOwnPropertyDescriptor(value, name);
        return !!descriptor && "value" in descriptor && boundedJson(descriptor.value, depth + 1, remaining, seen);
    });
    seen.delete(value);
    return valid;
}

function matches(schema: AiJsonSchema, value: unknown): boolean {
    if (schema.oneOf && schema.oneOf.filter(option => matches(option, value)).length !== 1) return false;
    if ("const" in schema && value !== schema.const) return false;
    if (schema.enum && !schema.enum.includes(value)) return false;
    const kind = value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
    if (schema.type) {
        const types = Array.isArray(schema.type) ? schema.type : [schema.type];
        if (!types.includes(kind) && !(types.includes("integer") && typeof value === "number" && Number.isInteger(value))) return false;
    }
    if (typeof value === "string") {
        if (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? Infinity)) return false;
        if (schema.pattern && !new RegExp(schema.pattern).test(value)) return false;
    }
    if (typeof value === "number" && (value < (schema.minimum ?? -Infinity) || value > (schema.maximum ?? Infinity))) return false;
    if (Array.isArray(value)) {
        if (value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? Infinity)) return false;
        if (schema.items && !value.every(item => matches(schema.items!, item))) return false;
        if (schema.uniqueItems && new Set(value.map(item => JSON.stringify(item))).size !== value.length) return false;
    }
    if (record(value)) {
        if (schema.required?.some(name => !Object.prototype.hasOwnProperty.call(value, name))) return false;
        for (const [name, child] of Object.entries(value)) {
            const property = schema.properties?.[name];
            if (!property && schema.additionalProperties === false) return false;
            if (property && !matches(property, child)) return false;
        }
    }
    return true;
}

function payloadVersions(value: unknown, registry?: AiPayloadRegistry): AiProtocolValidation<never> | undefined {
    if (Array.isArray(value)) {
        for (const child of value) {
            const problem = payloadVersions(child, registry);
            if (problem) return problem;
        }
    } else if (record(value)) {
        const completedSteps = value.completedSteps ?? value.completed_steps;
        const totalSteps = value.totalSteps ?? value.total_steps;
        if (typeof completedSteps === "number" && typeof totalSteps === "number" && completedSteps > totalSteps) {
            return invalid("completedSteps", "AI_PROGRESS_INVALID");
        }
        if (typeof value.allowed === "boolean" && typeof value.reason === "string" &&
            value.allowed !== (value.reason === "allowed")) return invalid("reason", "AI_QUOTA_OUTCOME_INVALID");
        const isAdmin = value.isAdmin ?? value.is_admin;
        const effortSelectable = value.effortSelectable ?? value.effort_selectable;
        if (isAdmin === false && effortSelectable === true) return invalid("effortSelectable", "AI_ACCESS_INVALID");
        const artifactId = value.toolId ?? value.tool_id ?? value.cardType ?? value.card_type;
        const artifactVersion = value.toolVersion ?? value.tool_version ?? value.cardVersion ?? value.card_version;
        if (typeof artifactId === "string" && typeof artifactVersion === "number") {
            const artifactKind = (value.toolId ?? value.tool_id) ? "tool" : "card";
            const artifactSchemaId = `ai.${artifactKind}.${artifactId}`;
            const available = registry?.resolve(artifactSchemaId, artifactVersion);
            if (!available || available.status !== "supported") {
                return { status: available?.status ?? "unsupported_version", schemaId: artifactSchemaId, schemaVersion: artifactVersion };
            }
        }
        const schemaId = value.schemaId ?? value.schema_id;
        const schemaVersion = value.schemaVersion ?? value.schema_version;
        if (typeof schemaId === "string" && typeof schemaVersion === "number" && record(value.payload)) {
            const resolved = registry?.resolve(schemaId, schemaVersion);
            if (!resolved || resolved.status !== "supported") {
                return { status: resolved?.status ?? "unsupported_version", schemaId, schemaVersion };
            }
            if (!resolved.validate(value.payload as AtJsonObject)) return invalid("payload", "AI_PAYLOAD_INVALID");
            return undefined;
        }
        for (const child of Object.values(value)) {
            const problem = payloadVersions(child, registry);
            if (problem) return problem;
        }
    }
    return undefined;
}

/** Dependency-free bounded validator for this protocol's schema subset, shared by browser and server. */
export function validateAiProtocol<T>(schema: AiJsonSchema, value: unknown, registry?: AiPayloadRegistry): AiProtocolValidation<T> {
    if (!boundedJson(value, 0, { nodes: 4096, characters: 65536 }, new Set())) return invalid("", "AI_JSON_INVALID");
    if (new TextEncoder().encode(JSON.stringify(value)).length > 65536) return invalid("", "AI_PAYLOAD_TOO_LARGE");
    if (record(value)) {
        const version = value.contractVersion ?? value.contract_version;
        if (typeof version === "number" && Number.isInteger(version) && version > 1) {
            return { status: "unsupported_version", schemaId: "ai.protocol", schemaVersion: version };
        }
    }
    if (!matches(schema, value)) return invalid("", "AI_SCHEMA_INVALID");
    try {
        const incompatible = payloadVersions(value, registry);
        if (incompatible) return incompatible;
    } catch {
        return invalid("", "AI_SCHEMA_REGISTRY_FAILED");
    }
    return { status: "valid", value: value as T };
}
