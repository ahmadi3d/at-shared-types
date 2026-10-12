const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compileAiContractSpecification, compileAiContractEditorDraft, AiContractCompilationError } = require("../dist/protocol.cjs");
const node = (path, kind, extra = {}) => ({
    path,
    kind,
    required: false,
    nullable: false,
    description: "",
    format: null,
    enum: [],
    additionalProperties: false,
    ...extra,
});
const specification = () => ({
    schemaVersion: 1,
    key: "customers.lookup",
    name: "Customers",
    description: "",
    effect: "read",
    inputNodes: [node("", "object"), node("/id", "integer", { required: true })],
    outputNodes: [
        node("", "array"),
        node("/*", "object"),
        node("/*/name", "string", { required: true, enum: ["Alice", "Bob"] }),
    ],
    representativeInputJson: '{"id":1}',
    mockOutputJson: '[{"name":"Alice"}]',
});
test("WHAT paths compile to native array/object shapes without implementation or lifecycle fields", () => {
    const result = compileAiContractSpecification(specification());
    assert.equal(result.draft.inputShape.fields[0].required, true);
    assert.equal(result.draft.outputShape.item.fields[0].shape.kind, "string");
    assert.deepEqual(result.draft.outputShape.item.fields[0].shape.enum, ["Alice", "Bob"]);
    assert.equal(result.draft.inputShape.additionalProperties, false);
    assert.equal(Object.hasOwn(result.draft, "status"), false);
    assert.equal(Object.hasOwn(result, "implementations"), false);
});
test("duplicate/orphan paths, invalid arrays and primitive children fail instead of silently losing fields", () => {
    for (const nodes of [
        [node("", "object"), node("/id", "integer"), node("/id", "string")],
        [node("", "object"), node("/missing/id", "integer")],
        [node("", "array")],
        [node("", "string"), node("/id", "integer")],
        [node("", "object"), node("/constructor", "string")],
    ]) {
        const input = specification();
        input.outputNodes = nodes;
        assert.throws(() => compileAiContractSpecification(input), AiContractCompilationError);
    }
});
test("wire contracts reject executable/credential fields and excessive or incompatible shape metadata", () => {
    for (const mutate of [
        (input) => (input.implementations = []),
        (input) => (input.status = "published"),
        (input) => (input.inputNodes[1].format = "email"),
        (input) => (input.inputNodes[1].path = "/a/b/c/d/e/f"),
        (input) => (input.outputNodes = Array.from({ length: 65 }, () => node("", "string"))),
    ]) {
        const input = specification();
        mutate(input);
        assert.throws(() => compileAiContractSpecification(input), AiContractCompilationError);
    }
});
test("editor fragments retain omitted sections and require an explicit output shape for mock replacement", () => {
    const fragment = { name: null, description: "Edited", effect: null, inputNodes: null, outputNodes: null,
        mockMode: "unchanged", mockOutputJson: null };
    assert.equal(compileAiContractEditorDraft(fragment).draft.description, "Edited");
    for (const value of [
        { ...fragment, description: null },
        { ...fragment, key: "replacement" },
        { ...fragment, mockMode: "replace", mockOutputJson: "[]" },
        { ...fragment, mockMode: "remove", mockOutputJson: "[]" },
    ]) assert.throws(() => compileAiContractEditorDraft(value), AiContractCompilationError);
    const result = compileAiContractEditorDraft({ ...fragment, mockMode: "replace", outputNodes: specification().outputNodes,
        mockOutputJson: '[{"name":"Alice"}]' });
    assert.deepEqual(result.example, [{ name: "Alice" }]);
    assert.equal(result.outputShape.kind, "array");
});
