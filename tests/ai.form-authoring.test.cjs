const assert = require("node:assert/strict");
const { test } = require("node:test");
const { compileAiFormSpecification, AiFormCompilationError, AiFormEditorDraftSchema, validateAiProtocol } = require("../dist/protocol.cjs");
const field = (name, control = "TextBox") => ({
    name,
    control,
    label: name,
    required: false,
    size: 6,
    enumKey: null,
    uiColumnKey: null,
    visibleWhen: null,
});
const specification = () => ({
    schemaVersion: 1,
    title: "Customer",
    description: "Public test",
    locale: "en",
    sections: [
        {
            name: "customerSection",
            label: "Customer",
            renderer: "Section",
            fields: [field("enabled", "CheckBox"), { ...field("details"), visibleWhen: { fieldName: "enabled" } }],
        },
    ],
});
const catalog = { enums: {}, uiColumns: {} };
test("closed editor proposals require exactly one of field changes or typed append", () => {
    const append = specification();
    const changes = [{ fieldName: "enabled", label: "Enabled", required: false }];
    for (const valid of [{ changes, append: null }, { changes: null, append }])
        assert.equal(validateAiProtocol(AiFormEditorDraftSchema, valid).status, "valid");
    for (const invalid of [
        { changes: null, append: null }, { changes, append }, { changes }, { append },
        { changes: null, append, script: "forbidden" },
        { changes: null, append: { ...append, dataGraph: {} } },
    ]) assert.equal(validateAiProtocol(AiFormEditorDraftSchema, invalid).status, "invalid");
});
test("deterministic authoring emits normalized native validation/layout/visibility without caller code or graph resources", () => {
    const input = specification(),
        before = JSON.stringify(input);
    const first = compileAiFormSpecification(input, catalog);
    assert.deepEqual(compileAiFormSpecification(input, catalog), first);
    assert.equal(JSON.stringify(input), before);
    assert.equal(first.definition.schemaVersion, 3);
    assert.deepEqual(first.definition.dataGraph, { version: 1, resources: {} });
    assert.deepEqual(first.definition.entities["field:details"].propertyBindings.visible, {
        kind: "runtimeValue",
        binding: { version: 1, value: { type: "formValue", path: "enabled" } },
    });
    assert.deepEqual(first.definition.entities["field:enabled"].properties.validation, { required: false });
    assert.equal(JSON.stringify(first).includes("javascript"), false);
});
test("invalid semantics are repairable issues, and closed specs cannot request script/resources/unsupported controls", () => {
    const mutate = (change) => {
        const input = specification();
        change(input);
        return input;
    };
    for (const input of [
        mutate((value) => {
            value.script = "forbidden";
        }),
        mutate((value) => {
            value.sections[0].fields[1].control = "UploadButton";
        }),
        mutate((value) => {
            value.sections[0].fields[1].name = "enabled";
        }),
        mutate((value) => {
            value.sections[0].fields[1].visibleWhen.fieldName = "missing";
        }),
        mutate((value) => {
            value.sections[0].fields[0].visibleWhen = { fieldName: "enabled" };
        }),
        mutate((value) => {
            value.sections[0].fields[1].uiColumnKey = "missing";
        }),
    ]) {
        assert.throws(
            () => compileAiFormSpecification(input, catalog),
            (error) => error instanceof AiFormCompilationError && error.issues.length > 0,
        );
    }
});
test("approved catalog resolves real enum bindings and cannot be weakened or replaced by model guesses", () => {
    const input = specification();
    input.locale = "fa";
    input.sections[0].fields.push({ ...field("customerTypeId", "ComboBox"), label: "", uiColumnKey: "customerTypeId" });
    const approved = {
        enums: { customerTypeId: { optionsAllowed: true } },
        uiColumns: {
            customerTypeId: {
                control: "ComboBox",
                enumKey: "customerTypeId",
                required: true,
                labels: { fa: "نوع مشتری" },
            },
        },
    };
    const compiled = compileAiFormSpecification(input, approved);
    const value = compiled.definition.entities["field:customerTypeId"];
    assert.equal(value.properties.label, "نوع مشتری");
    assert.equal(value.properties.validation.required, true);
    assert.deepEqual(value.propertyBindings.options.binding.source, {
        type: "enum",
        config: { enumKey: "customerTypeId" },
    });
    assert(compiled.warnings.some((warning) => warning.code === "AI_FORM_CATALOG_REQUIRED"));
    approved.enums.customerTypeId.optionsAllowed = false;
    assert.throws(
        () => compileAiFormSpecification(input, approved),
        (error) => error.issues.some((issue) => issue.code === "AI_FORM_ENUM_UNAVAILABLE"),
    );
});
