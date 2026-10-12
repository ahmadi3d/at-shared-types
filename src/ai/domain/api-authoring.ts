import type { AtJsonObject, AtJsonPrimitive, AtJsonValue } from "../../core/domain/json.types";

export type AiApiValueType = "string" | "number" | "integer" | "boolean" | "null";
export interface AiApiExampleField {
    name: string;
    type: AiApiValueType;
    example: AtJsonPrimitive;
    required: boolean;
}
export interface AiApiResponseMapping {
    name: string;
    sourcePointer: string;
    type: AiApiValueType;
    required: boolean;
}
export interface AiApiSpecification {
    schemaVersion: 1;
    title: string;
    description: string;
    connectionProfileId: string;
    httpMethodId: 1 | 2 | 3 | 4;
    endpointPath: string;
    parameters: { name: string; example: string; description: string }[];
    bodyFields: AiApiExampleField[];
    responseMappings: AiApiResponseMapping[];
    postScript: string | null;
}
/** Owning backend supplies approved endpoints and revisions; this is never accepted inside a tool input. */
export interface AiApiAuthoringCatalog {
    profiles: Record<
        string,
        {
            origin: string;
            basePath: string;
            allowedMethods: (1 | 2 | 3 | 4)[];
            revision: string;
        }
    >;
}
export interface AiApiCompilationIssue {
    code: string;
    path: string;
}
export interface AiCompiledApi {
    definition: AtJsonObject;
    warnings: AiApiCompilationIssue[];
}
export interface AiApiMockPreview {
    request: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        url: string;
        parameters: Record<string, string>;
        body: AtJsonObject | null;
    };
    response: AtJsonObject;
    issues: AiApiCompilationIssue[];
    scriptExecuted: false;
}
export type AiApiMockResponse = AtJsonValue;

/** Closed, reversible edits to examples and mappings. Endpoint and credential changes are never proposed. */
export interface AiApiEditorDraft {
    postScript: string | null;
    parameters: AiApiSpecification["parameters"] | null;
    bodyFields: AiApiExampleField[] | null;
    responseMappings: AiApiResponseMapping[] | null;
}
