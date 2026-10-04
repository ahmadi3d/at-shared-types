import type {
    WorkflowCompletionAction,
    WorkflowTaskEligibilityClause,
    WorkflowTaskEligibilityPolicy,
    WorkflowTaskMatchMode,
    WorkflowUserTaskDefinitionV3,
    WorkflowUserTaskDefinitionV4,
    WorkflowUserTaskDefinition,
    WorkflowTaskMultiInstance,
} from "../domain/model";

export const WORKFLOW_TASK_MAX_CLAUSES = 8;
export const WORKFLOW_TASK_MAX_PREDICATE_KEYS = 32;
const rolePattern = "^[a-z][a-z0-9-]{0,99}$";
const permissionPattern = "^[a-z][a-z0-9-]*(\\.[a-z][a-z0-9-]*){2,}$";
const roleKey = new RegExp(rolePattern);
const permissionKey = new RegExp(permissionPattern);
const blockedSegments = new Set(["__proto__", "prototype", "constructor"]);
const contextSegment = /^[A-Za-z_][A-Za-z0-9_]*$/;
const actionKey = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;

const objectSchema = (properties: Record<string, unknown>, required: string[]) => ({
    type: "object", additionalProperties: false, properties, required,
});
const keyArraySchema = (pattern: string, maxLength: number) => ({
    type: "array",
    minItems: 1,
    maxItems: WORKFLOW_TASK_MAX_PREDICATE_KEYS,
    uniqueItems: true,
    items: { type: "string", pattern, maxLength },
});

export const WorkflowTaskEligibilityPolicySchema = objectSchema({
    anyOf: {
        type: "array",
        minItems: 1,
        maxItems: WORKFLOW_TASK_MAX_CLAUSES,
        uniqueItems: true,
        items: {
            ...objectSchema({
                roleKeys: keyArraySchema(rolePattern, 100),
                roleMatch: { enum: ["ANY", "ALL"] },
                permissionKeys: keyArraySchema(permissionPattern, 150),
                permissionMatch: { enum: ["ANY", "ALL"] },
            }, []),
            anyOf: [{ required: ["roleKeys"] }, { required: ["permissionKeys"] }],
            dependencies: { roleMatch: ["roleKeys"], permissionMatch: ["permissionKeys"] },
        },
    },
    excludedPermissionKeys: keyArraySchema(permissionPattern, 150),
}, ["anyOf"]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value);
const closed = (value: Record<string, unknown>, keys: readonly string[]) =>
    Object.keys(value).every(key => keys.includes(key));
const keys = (value: unknown, pattern: RegExp, maxLength: number): string[] | null => {
    if (!Array.isArray(value) || value.length < 1 || value.length > WORKFLOW_TASK_MAX_PREDICATE_KEYS ||
        Array.from(value).some(item => typeof item !== "string" || item.length > maxLength || !pattern.test(item)) ||
        new Set(value).size !== value.length) return null;
    return [...value].sort();
};
const mode = (value: unknown): WorkflowTaskMatchMode | null =>
    value === undefined ? "ANY" : value === "ANY" || value === "ALL" ? value : null;

/** Empty access is available only for explicitly unconfigured authored drafts. */
export function normalizeWorkflowTaskEligibilityPolicy(
    value: unknown,
    allowUnconfiguredDraft = false,
): WorkflowTaskEligibilityPolicy | null {
    if (!isRecord(value) || !closed(value, ["anyOf", "excludedPermissionKeys"]) ||
        !Array.isArray(value.anyOf) || value.anyOf.length > WORKFLOW_TASK_MAX_CLAUSES ||
        value.anyOf.length === 0 && !allowUnconfiguredDraft) return null;
    const clauses: WorkflowTaskEligibilityClause[] = [];
    const seen = new Set<string>();
    for (const item of value.anyOf) {
        if (!isRecord(item) || !closed(item, ["roleKeys", "roleMatch", "permissionKeys", "permissionMatch"])) return null;
        const clause: WorkflowTaskEligibilityClause = {};
        if (item.roleKeys !== undefined) {
            const roleKeys = keys(item.roleKeys, roleKey, 100);
            const roleMatch = mode(item.roleMatch);
            if (!roleKeys || !roleMatch) return null;
            clause.roleKeys = roleKeys;
            clause.roleMatch = roleMatch;
        } else if (item.roleMatch !== undefined) return null;
        if (item.permissionKeys !== undefined) {
            const permissionKeys = keys(item.permissionKeys, permissionKey, 150);
            const permissionMatch = mode(item.permissionMatch);
            if (!permissionKeys || !permissionMatch) return null;
            clause.permissionKeys = permissionKeys;
            clause.permissionMatch = permissionMatch;
        } else if (item.permissionMatch !== undefined) return null;
        if (!clause.roleKeys && !clause.permissionKeys) return null;
        const identity = JSON.stringify(clause);
        if (seen.has(identity)) return null;
        seen.add(identity);
        clauses.push(clause);
    }
    const policy: WorkflowTaskEligibilityPolicy = {
        anyOf: clauses.sort((left, right) => {
            const a = JSON.stringify(left);
            const b = JSON.stringify(right);
            return a < b ? -1 : a > b ? 1 : 0;
        }),
    };
    if (value.excludedPermissionKeys !== undefined) {
        const excluded = keys(value.excludedPermissionKeys, permissionKey, 150);
        if (!excluded) return null;
        policy.excludedPermissionKeys = excluded;
    }
    return policy;
}

/** Discovery hints intentionally over-approximate ALL/AND/exclusions. Never authorize with them. */
export function deriveWorkflowTaskCandidateGroups(value: WorkflowTaskEligibilityPolicy): string[] {
    const policy = normalizeWorkflowTaskEligibilityPolicy(value);
    if (!policy) throw new Error("A configured task eligibility policy is required.");
    return [...new Set(policy.anyOf.flatMap(clause => [
        ...(clause.roleKeys ?? []).map(key => `role:${key}`),
        ...(clause.permissionKeys ?? []).map(key => `perm:${key}`),
    ]))].sort();
}

const path = (value: unknown): value is string => typeof value === "string" &&
    value.length > 0 && value.length <= 500 && value.split(".").every(segment =>
        contextSegment.test(segment) && !blockedSegments.has(segment));
const positiveId = (value: unknown): value is string | number =>
    typeof value === "number" ? Number.isSafeInteger(value) && value > 0 && value <= 2147483647 :
        typeof value === "string" && /^[1-9][0-9]{0,9}$/.test(value) && Number(value) <= 2147483647;
const optionalText = (value: unknown, max: number) =>
    value == null || typeof value === "string" && value.length <= max;

/** Shared transport validation; backend additionally validates hooks, catalogs and frozen references. */
export function normalizeWorkflowUserTaskDefinitionV3(
    value: unknown,
    allowUnconfiguredDraft = false,
): WorkflowUserTaskDefinitionV3 | null {
    return normalizeTaskDefinitionFields(value, allowUnconfiguredDraft, false);
}

function normalizeTaskDefinitionFields(
    value: unknown,
    allowUnconfiguredDraft: boolean,
    allowTaskRoutineHooks: boolean,
): WorkflowUserTaskDefinitionV3 | null {
    if (!isRecord(value) || !closed(value, ["version", "formId", "contextPath", "outcomePath", "completionActions", "execution", "eligibility"]) ||
        value.version !== 3 || !positiveId(value.formId) || !path(value.contextPath) ||
        value.outcomePath != null && !path(value.outcomePath)) return null;
    const eligibility = normalizeWorkflowTaskEligibilityPolicy(value.eligibility, allowUnconfiguredDraft);
    if (!eligibility) return null;
    const actions = value.completionActions === undefined
        ? [{ key: "proceed", label: "Proceed", intent: "primary" }]
        : value.completionActions;
    if (!Array.isArray(actions) || actions.length < 1 || actions.length > 32 || actions.length > 1 && !value.outcomePath) return null;
    const seen = new Set<string>();
    for (const action of actions) {
        if (!isRecord(action) || !closed(action, ["key", "label", "confirmationMessage", "intent"]) ||
            typeof action.key !== "string" || !actionKey.test(action.key) || seen.has(action.key) ||
            typeof action.label !== "string" || !action.label.trim() || action.label.length > 150 ||
            !optionalText(action.confirmationMessage, 2000) ||
            action.intent !== undefined && !["primary", "secondary", "danger"].includes(String(action.intent))) return null;
        seen.add(action.key);
    }
    const execution = value.execution;
    let normalizedExecution: WorkflowUserTaskDefinitionV3["execution"] = execution == null
        ? execution as null | undefined
        : undefined;
    if (execution != null) {
        if (!isRecord(execution) || !closed(execution, ["mode", "config"]) || execution.mode !== "script" ||
            !isRecord(execution.config) || !closed(execution.config, ["language", "apiVersion", "source", "routineReferences"]) ||
            execution.config.language !== "javascript" || execution.config.apiVersion !== 2 ||
            typeof execution.config.source !== "string" ||
            !allowUnconfiguredDraft && !execution.config.source.trim() ||
            execution.config.source.length > 524288) return null;
        const references = execution.config.routineReferences;
        if (references !== undefined) {
            if (!Array.isArray(references) || references.length > 64) return null;
            for (const reference of references) {
                const keys = ["database", "schema", "apiName", "registrationStamp"];
                if (allowTaskRoutineHooks) keys.push("taskHooks");
                if (!isRecord(reference) || !closed(reference, keys) ||
                    ["database", "schema", "apiName"].some(key => typeof reference[key] !== "string" ||
                        !/^[A-Za-z_][A-Za-z0-9_]{0,127}$/.test(reference[key] as string)) ||
                    reference.registrationStamp !== undefined &&
                    (typeof reference.registrationStamp !== "string" || !reference.registrationStamp || reference.registrationStamp.length > 200)) return null;
                if (reference.taskHooks !== undefined && (!Array.isArray(reference.taskHooks) ||
                    reference.taskHooks.length < 1 || reference.taskHooks.length > 2 ||
                    new Set(reference.taskHooks).size !== reference.taskHooks.length ||
                    reference.taskHooks.some(hook => hook !== "load" && hook !== "proceed"))) return null;
            }
        }
        normalizedExecution = {
            mode: "script",
            config: {
                language: "javascript",
                apiVersion: 2,
                source: execution.config.source,
                ...(references === undefined ? {} : {
                    routineReferences: (references as Record<string, unknown>[]).map(reference => ({
                        database: reference.database as string,
                        schema: reference.schema as string,
                        apiName: reference.apiName as string,
                        ...(reference.registrationStamp === undefined ? {} : {
                            registrationStamp: reference.registrationStamp as string,
                        }),
                        ...(reference.taskHooks === undefined ? {} : {
                            taskHooks: [...reference.taskHooks as ("load" | "proceed")[]],
                        }),
                    })),
                }),
            },
        };
    }
    return {
        version: 3,
        formId: value.formId,
        contextPath: value.contextPath,
        outcomePath: value.outcomePath as string | null | undefined,
        completionActions: actions.map(action => ({ ...action })) as WorkflowCompletionAction[],
        execution: normalizedExecution,
        eligibility,
    };
}

/** V4 shares form, eligibility and execution validation, without legacy action properties. */
export function normalizeWorkflowUserTaskDefinitionV4(
    value: unknown,
    allowUnconfiguredDraft = false,
): WorkflowUserTaskDefinitionV4 | null {
    if (!isRecord(value) || value.version !== 4 ||
        !closed(value, ["version", "formId", "contextPath", "eligibility", "execution", "multiInstance"])) return null;
    const { multiInstance: rawMultiInstance, ...fields } = value;
    const multiInstance = rawMultiInstance === undefined ? undefined : normalizeWorkflowTaskMultiInstance(rawMultiInstance);
    if (multiInstance === null) return null;
    const normalized = normalizeTaskDefinitionFields({ ...fields, version: 3 }, allowUnconfiguredDraft, true);
    if (!normalized) return null;
    return {
        version: 4,
        formId: normalized.formId,
        contextPath: normalized.contextPath,
        eligibility: normalized.eligibility,
        ...(normalized.execution === undefined ? {} : { execution: normalized.execution }),
        ...(multiInstance === undefined ? {} : { multiInstance }),
    };
}

/** Closed native MI pattern; arbitrary EL, cardinalities and completion conditions are excluded. */
export function normalizeWorkflowTaskMultiInstance(value: unknown): WorkflowTaskMultiInstance | null {
    const variable = (name: unknown): name is string => typeof name === "string" &&
        name.length <= 64 && contextSegment.test(name) && !blockedSegments.has(name) &&
        !/^(at|nrOf)/i.test(name);
    if (!isRecord(value) || !closed(value, ["collectionPath", "itemVariable", "indexVariable", "sequential", "resourceScope"]) ||
        !path(value.collectionPath) || !variable(value.itemVariable) || value.itemVariable === "loopCounter" ||
        value.indexVariable !== undefined && !variable(value.indexVariable) ||
        value.itemVariable === (value.indexVariable ?? "loopCounter") || typeof value.sequential !== "boolean" ||
        !isRecord(value.resourceScope) || !closed(value.resourceScope, ["telecomUnitPath", "billingRunReviewIdPath"]) ||
        !path(value.resourceScope.telecomUnitPath) ||
        value.resourceScope.billingRunReviewIdPath !== undefined && !path(value.resourceScope.billingRunReviewIdPath)) return null;
    return {
        collectionPath: value.collectionPath,
        itemVariable: value.itemVariable,
        ...(value.indexVariable === undefined ? {} : { indexVariable: value.indexVariable as string }),
        sequential: value.sequential,
        resourceScope: {
            telecomUnitPath: value.resourceScope.telecomUnitPath,
            ...(value.resourceScope.billingRunReviewIdPath === undefined ? {} : {
                billingRunReviewIdPath: value.resourceScope.billingRunReviewIdPath as string,
            }),
        },
    };
}

/** Runtime reads the frozen version explicitly; published V3 is never upgraded. */
export function normalizeWorkflowUserTaskDefinition(value: unknown): WorkflowUserTaskDefinition | null {
    return normalizeWorkflowUserTaskDefinitionV4(value) ?? normalizeWorkflowUserTaskDefinitionV3(value);
}

/** One-time authored draft upgrade. Missing access stays unconfigured and cannot publish. */
export function upgradeLegacyWorkflowUserTaskDraft(value: unknown): WorkflowUserTaskDefinitionV3 | null {
    if (!isRecord(value) || value.version !== 2 ||
        !closed(value, ["version", "formId", "contextPath", "outcomePath", "completionActions", "execution"])) return null;
    return normalizeWorkflowUserTaskDefinitionV3({ ...value, version: 3, eligibility: { anyOf: [] } }, true);
}
