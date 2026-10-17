import type { AtJsonObject, AtJsonValue } from "../../core/domain/json.types";
import type {
    AiApiAuthoringCatalog,
    AiApiCompilationIssue,
    AiApiMockPreview,
    AiApiSpecification,
    AiApiValueType,
    AiCompiledApi,
    AiApiEditorDraft,
} from "../domain/api-authoring";
import { AiApiSpecificationSchema, AiApiEditorDraftSchema } from "../protocol/api-authoring";
import { validateAiProtocol } from "../protocol/platform-validation";

export class AiApiCompilationError extends Error {
    constructor(readonly issues: AiApiCompilationIssue[]) {
        super("AI_API_COMPILATION_INVALID");
        this.name = "AiApiCompilationError";
    }
}
const own = (object: object, name: string) => Object.prototype.hasOwnProperty.call(object, name);
const blocked = new Set(["constructor", "prototype", "__proto__"]);
const matchesType = (value: unknown, type: AiApiValueType) =>
    type === "null"
        ? value === null
        : type === "integer"
          ? Number.isSafeInteger(value)
          : type === "number"
            ? typeof value === "number" && Number.isFinite(value)
            : typeof value === type;
const methodNames = { 1: "GET", 2: "POST", 3: "PUT", 4: "DELETE" } as const;
const pointerParts = (pointer: string): string[] | null => {
    if (pointer === "") return [];
    if (!pointer.startsWith("/") || /~(?![01])/.test(pointer)) return null;
    const parts = pointer
        .slice(1)
        .split("/")
        .map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
    return parts.length <= 16 && parts.every((part) => part.length > 0 && !blocked.has(part)) ? parts : null;
};

/** Produces native editor data only. Compilation cannot invoke a URL, activate an endpoint or execute script text. */
export function compileAiApiSpecification(input: unknown, catalog: AiApiAuthoringCatalog): AiCompiledApi {
    const parsed = validateAiProtocol<AiApiSpecification>(AiApiSpecificationSchema, input);
    if (parsed.status !== "valid") throw new AiApiCompilationError([{ code: "AI_API_SPEC_INVALID", path: "/" }]);
    const spec = parsed.value;
    const issues: AiApiCompilationIssue[] = [];
    const issue = (code: string, path: string) => issues.push({ code, path });
    const profile = own(catalog.profiles, spec.connectionProfileId)
        ? catalog.profiles[spec.connectionProfileId]
        : undefined;
    let endpoint = "";
    if (!profile) issue("AI_API_CONNECTION_PROFILE_UNAVAILABLE", "/connectionProfileId");
    else {
        try {
            const origin = new URL(profile.origin);
            if (
                !["http:", "https:"].includes(origin.protocol) ||
                origin.origin !== profile.origin ||
                origin.username ||
                origin.password ||
                !profile.revision ||
                !profile.allowedMethods.includes(spec.httpMethodId)
            )
                throw new Error();
            if (
                !/^\/[a-zA-Z0-9/_\-.]*$/.test(spec.endpointPath) ||
                spec.endpointPath.split("/").includes("..") ||
                !/^\/[a-zA-Z0-9/_\-.]*$/.test(profile.basePath) ||
                profile.basePath.split("/").includes("..")
            )
                throw new Error();
            const prefix = profile.basePath === "/" ? "/" : profile.basePath.replace(/\/$/, "") + "/";
            if (spec.endpointPath !== profile.basePath && !spec.endpointPath.startsWith(prefix)) throw new Error();
            endpoint = new URL(spec.endpointPath, profile.origin).href;
            if (new URL(endpoint).origin !== profile.origin) throw new Error();
        } catch {
            issue("AI_API_ENDPOINT_NOT_APPROVED", "/endpointPath");
        }
    }
    const claim = (items: { name: string }[], path: string) => {
        const names = new Set<string>();
        items.forEach((item, index) => {
            if (blocked.has(item.name) || names.has(item.name)) issue("AI_API_NAME_INVALID", `${path}/${index}/name`);
            names.add(item.name);
        });
    };
    claim(spec.parameters, "/parameters");
    claim(spec.bodyFields, "/bodyFields");
    claim(spec.responseMappings, "/responseMappings");
    if (spec.httpMethodId === 1 && spec.bodyFields.length) issue("AI_API_GET_BODY_UNSUPPORTED", "/bodyFields");
    spec.bodyFields.forEach((field, index) => {
        if (!matchesType(field.example, field.type))
            issue("AI_API_EXAMPLE_TYPE_INVALID", `/bodyFields/${index}/example`);
    });
    spec.responseMappings.forEach((mapping, index) => {
        if (!pointerParts(mapping.sourcePointer))
            issue("AI_API_RESPONSE_POINTER_INVALID", `/responseMappings/${index}/sourcePointer`);
    });
    if (issues.length) throw new AiApiCompilationError(issues);
    const body = Object.fromEntries(spec.bodyFields.map((field) => [field.name, field.example]));
    const definition: AtJsonObject = {
        config: {
            name: spec.title,
            description: spec.description,
            http_method_id: spec.httpMethodId,
            url: endpoint,
            params: spec.parameters.map((parameter) => ({
                key: parameter.name,
                value: parameter.example,
                description: parameter.description,
            })),
            headers: spec.bodyFields.length
                ? [{ key: "Content-Type", value: "application/json", description: "" }]
                : [],
            authorization: { api_authorization_type_id: 1 },
            body: spec.bodyFields.length
                ? { api_body_type_id: 4, raw: JSON.stringify(body, null, 2) }
                : { api_body_type_id: 1 },
        },
        script: { post_script: spec.postScript ?? "" },
        response_mappings: spec.responseMappings.map((mapping) => ({ ...mapping })),
        authoring: {
            schemaVersion: 1,
            state: "draft",
            connectionProfileId: spec.connectionProfileId,
            connectionProfileRevision: profile!.revision,
        },
    };
    if (new TextEncoder().encode(JSON.stringify(definition)).length > 48000)
        throw new AiApiCompilationError([{ code: "AI_API_DEFINITION_TOO_LARGE", path: "/" }]);
    return {
        definition,
        warnings: spec.postScript ? [{ code: "AI_API_SCRIPT_REVIEW_REQUIRED", path: "/postScript" }] : [],
    };
}

/** Validate native local edits without receiving a connection profile or an outbound endpoint. */
export function compileAiApiEditorDraft(
    input: unknown,
    httpMethodId: 1 | 2 | 3 | 4 = 2,
): {
    draft: AiApiEditorDraft;
    config: AtJsonObject;
    responseMappings: AtJsonValue[];
} {
    const parsed = validateAiProtocol<AiApiEditorDraft>(AiApiEditorDraftSchema, input);
    if (parsed.status !== "valid" || Object.values(parsed.value).every((value) => value === null))
        throw new AiApiCompilationError([{ code: "AI_API_EDITOR_INPUT_INVALID", path: "/" }]);
    const draft = parsed.value;
    const compiled = compileAiApiSpecification(
        {
            schemaVersion: 1,
            title: "Local draft",
            description: "",
            connectionProfileId: "local",
            httpMethodId,
            endpointPath: "/",
            parameters: draft.parameters ?? [],
            bodyFields: draft.bodyFields ?? [],
            responseMappings: draft.responseMappings ?? [],
            postScript: draft.postScript,
        },
        {
            profiles: {
                local: {
                    origin: "https://example.invalid",
                    basePath: "/",
                    allowedMethods: [1, 2, 3, 4],
                    revision: "local",
                },
            },
        },
    );
    return {
        draft: structuredClone(draft),
        config: compiled.definition.config as AtJsonObject,
        responseMappings: compiled.definition.response_mappings as AtJsonValue[],
    };
}

/** Bounded fixture JSON; ordinary response fields never acquire AI protocol/version semantics. No getters are read. */
function safeFixture(input: unknown): AtJsonValue | undefined {
    let nodes = 4096;
    let characters = 48000;
    const ancestors = new Set<object>();
    const invalid = () => {
        throw new Error("AI_API_MOCK_RESPONSE_INVALID");
    };
    const visit = (value: unknown, depth: number): AtJsonValue => {
        if (--nodes < 0 || depth > 16) return invalid();
        if (typeof value === "string") {
            characters -= value.length;
            if (characters < 0) return invalid();
            return value;
        }
        if (value === null || typeof value === "boolean") return value;
        if (typeof value === "number") {
            if (!Number.isFinite(value)) return invalid();
            return value;
        }
        if (!value || typeof value !== "object" || ancestors.has(value)) return invalid();
        if (!Array.isArray(value) && ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return invalid();
        if (Array.isArray(value) && value.length > 4096) return invalid();
        ancestors.add(value);
        const cloned: AtJsonObject | AtJsonValue[] = Array.isArray(value) ? [] : Object.create(null);
        for (const key of Reflect.ownKeys(value)) {
            if (typeof key !== "string" || blocked.has(key)) return invalid();
            if (Array.isArray(value) && key === "length") continue;
            characters -= key.length;
            const descriptor = Object.getOwnPropertyDescriptor(value, key);
            if (characters < 0 || !descriptor?.enumerable || !("value" in descriptor)) return invalid();
            if (Array.isArray(cloned)) {
                if (!/^(0|[1-9][0-9]*)$/.test(key) || Number(key) !== cloned.length) return invalid();
                cloned.push(visit(descriptor.value, depth + 1));
            } else cloned[key] = visit(descriptor.value, depth + 1);
        }
        if (Array.isArray(value) && Array.isArray(cloned) && cloned.length !== value.length) return invalid();
        ancestors.delete(value);
        return cloned;
    };
    try {
        const cloned = visit(input, 0);
        return new TextEncoder().encode(JSON.stringify(cloned)).length <= 48000 ? cloned : undefined;
    } catch {
        return undefined;
    }
}

/** Deterministic JSON-pointer mapping over public mock inputs. Proposed JavaScript is never interpreted. */
export function previewAiApiSpecification(
    input: unknown,
    catalog: AiApiAuthoringCatalog,
    sample: unknown,
): AiApiMockPreview {
    const compiled = compileAiApiSpecification(input, catalog);
    const fixture = safeFixture(sample);
    if (fixture === undefined)
        throw new AiApiCompilationError([{ code: "AI_API_MOCK_RESPONSE_INVALID", path: "/sample" }]);
    const spec = input as AiApiSpecification;
    const response: AtJsonObject = {};
    const issues: AiApiCompilationIssue[] = [...compiled.warnings];
    for (const [index, mapping] of spec.responseMappings.entries()) {
        let value: unknown = fixture;
        for (const part of pointerParts(mapping.sourcePointer)!) {
            if (!value || typeof value !== "object" || !own(value, part)) {
                value = undefined;
                break;
            }
            value = Object.getOwnPropertyDescriptor(value, part)?.value;
        }
        if (value === undefined && !mapping.required) continue;
        if (!matchesType(value, mapping.type))
            issues.push({
                code: value === undefined ? "AI_API_RESPONSE_VALUE_MISSING" : "AI_API_RESPONSE_TYPE_INVALID",
                path: `/responseMappings/${index}`,
            });
        else response[mapping.name] = value as AtJsonValue;
    }
    return {
        request: {
            method: methodNames[spec.httpMethodId],
            url: (compiled.definition.config as AtJsonObject).url as string,
            parameters: Object.fromEntries(spec.parameters.map((parameter) => [parameter.name, parameter.example])),
            body: spec.bodyFields.length
                ? Object.fromEntries(spec.bodyFields.map((field) => [field.name, field.example]))
                : null,
        },
        response,
        issues,
        scriptExecuted: false,
    };
}
