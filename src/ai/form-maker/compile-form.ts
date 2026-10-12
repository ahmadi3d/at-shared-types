import type { AtJsonObject } from "../../core/domain/json.types";
import type {
    AiCompiledForm,
    AiFormAuthoringCatalog,
    AiFormCompilationIssue,
    AiFormFieldSpecification,
    AiFormSpecification,
} from "../domain/form-authoring";
import { AiFormSpecificationSchema } from "../protocol/form-authoring";
import { validateAiProtocol } from "../protocol/platform-validation";

export class AiFormCompilationError extends Error {
    constructor(readonly issues: AiFormCompilationIssue[]) {
        super("AI_FORM_COMPILATION_INVALID");
        this.name = "AiFormCompilationError";
    }
}
const own = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);
const blockedNames = new Set(["constructor", "prototype", "__proto__"]);
const selections = new Set(["ComboBox", "MultiComboBox"]);

/** Pure normalized-V3 authoring. Catalogs are supplied by the owning server, never by a model or browser request. */
export function compileAiFormSpecification(input: unknown, catalog: AiFormAuthoringCatalog): AiCompiledForm {
    const parsed = validateAiProtocol<AiFormSpecification>(AiFormSpecificationSchema, input);
    if (parsed.status !== "valid") throw new AiFormCompilationError([{ code: "AI_FORM_SPEC_INVALID", path: "/" }]);
    const spec = parsed.value;
    const issues: AiFormCompilationIssue[] = [],
        warnings: AiFormCompilationIssue[] = [];
    const names = new Set<string>(),
        fields = new Map<string, AiFormFieldSpecification>();
    const issue = (code: string, path: string) => issues.push({ code, path });
    const claim = (name: string, path: string) => {
        if (blockedNames.has(name) || names.has(name)) issue("AI_FORM_NAME_INVALID", path);
        names.add(name);
    };
    spec.sections.forEach((section, sectionIndex) => {
        claim(section.name, `/sections/${sectionIndex}/name`);
        section.fields.forEach((field, fieldIndex) => {
            claim(field.name, `/sections/${sectionIndex}/fields/${fieldIndex}/name`);
            fields.set(field.name, field);
        });
    });
    if (fields.size > 64) issue("AI_FORM_FIELD_LIMIT", "/sections");
    for (const [name, field] of fields) {
        const target = field.visibleWhen?.fieldName;
        if (target && (target === name || fields.get(target)?.control !== "CheckBox"))
            issue("AI_FORM_CONDITION_INVALID", `/fields/${name}/visibleWhen`);
        const visited = new Set([name]);
        let current = target;
        while (current && fields.has(current)) {
            if (visited.has(current)) {
                issue("AI_FORM_CONDITION_CYCLE", `/fields/${name}/visibleWhen`);
                break;
            }
            visited.add(current);
            current = fields.get(current)?.visibleWhen?.fieldName;
        }
    }
    const entities: AtJsonObject = {};
    const rootIds: string[] = [];
    spec.sections.forEach((section, sectionIndex) => {
        const sectionId = "section:" + section.name;
        const children: string[] = [];
        rootIds.push(sectionId);
        entities[sectionId] = {
            id: sectionId,
            kind: "layout",
            registryId: "Layout",
            parentId: null,
            children,
            properties: { name: section.name, renderer: section.renderer, title: section.label, size: 12 },
        };
        section.fields.forEach((field, fieldIndex) => {
            const path = `/sections/${sectionIndex}/fields/${fieldIndex}`;
            const column =
                field.uiColumnKey && own(catalog.uiColumns, field.uiColumnKey)
                    ? catalog.uiColumns[field.uiColumnKey]
                    : null;
            if (field.uiColumnKey && !column) issue("AI_FORM_UI_COLUMN_UNAVAILABLE", path + "/uiColumnKey");
            if (column && column.control !== field.control)
                issue("AI_FORM_UI_COLUMN_CONTROL_MISMATCH", path + "/control");
            if (column?.enumKey && field.enumKey && column.enumKey !== field.enumKey)
                issue("AI_FORM_ENUM_MISMATCH", path + "/enumKey");
            const enumKey = column?.enumKey ?? field.enumKey;
            if (enumKey && (!own(catalog.enums, enumKey) || !catalog.enums[enumKey].optionsAllowed))
                issue("AI_FORM_ENUM_UNAVAILABLE", path + "/enumKey");
            if (selections.has(field.control) !== Boolean(enumKey))
                issue("AI_FORM_OPTIONS_REQUIRED", path + "/enumKey");
            const label = field.label || column?.labels[spec.locale] || field.name;
            if (!field.label && !column?.labels[spec.locale])
                warnings.push({ code: "AI_FORM_LABEL_FALLBACK", path: path + "/label" });
            if (column?.required && !field.required)
                warnings.push({ code: "AI_FORM_CATALOG_REQUIRED", path: path + "/required" });
            const properties: AtJsonObject = {
                name: field.name,
                label,
                size: field.size,
                validation: { required: field.required || column?.required === true },
            };
            if (field.visibleWhen && (field.required || column?.required))
                issue("AI_FORM_CONDITIONAL_REQUIRED_UNSUPPORTED", path + "/required");
            const propertyBindings: AtJsonObject = {};
            if (enumKey)
                propertyBindings.options = {
                    kind: "inlineDataSource",
                    binding: { version: 1, source: { type: "enum", config: { enumKey } } },
                };
            if (field.visibleWhen)
                propertyBindings.visible = {
                    kind: "runtimeValue",
                    binding: { version: 1, value: { type: "formValue", path: field.visibleWhen.fieldName } },
                };
            const id = "field:" + field.name;
            children.push(id);
            entities[id] = {
                id,
                kind: "field",
                registryId: field.control,
                parentId: sectionId,
                children: [],
                properties,
                ...(Object.keys(propertyBindings).length ? { propertyBindings } : {}),
            };
        });
    });
    if (issues.length) throw new AiFormCompilationError(issues.slice(0, 64));
    const definition: AtJsonObject = {
        schemaVersion: 3,
        meta: { id: "", type: "default" },
        entities,
        rootIds,
        dataGraph: { version: 1, resources: {} },
    };
    if (new TextEncoder().encode(JSON.stringify(definition)).byteLength > 48000)
        throw new AiFormCompilationError([{ code: "AI_FORM_DOCUMENT_LIMIT", path: "/" }]);
    return { definition, warnings };
}
