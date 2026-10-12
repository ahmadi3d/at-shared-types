const test = require("node:test");
const assert = require("node:assert/strict");
const { compileAiBpmnSpecification, AiBpmnCompilationError } = require("../dist/protocol.cjs");

const step = (id, kind, definitionJson = null, formVersionId = null) => ({
    id,
    kind,
    name: id,
    definitionJson,
    formVersionId,
});
const flow = (id, sourceId, targetId, condition = null, defaultRoute = false) => ({
    id,
    sourceId,
    targetId,
    name: "",
    condition,
    defaultRoute,
});
const specification = () => ({
    schemaVersion: 1,
    title: "Fiber installation",
    description: "Public customer/rejection fixture",
    metadataJson: null,
    steps: [
        step("Start", "start"),
        step(
            "Survey",
            "user-task",
            JSON.stringify({
                version: 4,
                formId: 12,
                contextPath: "survey",
                eligibility: { anyOf: [{ roleKeys: ["engineer"] }] },
            }),
            21,
        ),
        step("Decision", "exclusive-gateway"),
        step("Install", "end"),
        step("Reject", "end"),
    ],
    transitions: [
        flow("StartSurvey", "Start", "Survey"),
        flow("SurveyDecision", "Survey", "Decision"),
        flow("Accepted", "Decision", "Install", "${atContext.survey.accepted == true}"),
        flow("Rejected", "Decision", "Reject", null, true),
    ],
});
test("closed fiber/rejection intent compiles deterministically to native V4 extensions and editable diagram geometry", () => {
    const result = compileAiBpmnSpecification(specification(), "ai_preview_fixture");
    assert.deepEqual(compileAiBpmnSpecification(specification(), "ai_preview_fixture"), result);
    assert.deepEqual(result.forms, [{ bpmnElementId: "Node_Survey", formId: 12, formVersionId: 21 }]);
    assert.match(result.xml, /at:TaskData/);
    assert.match(result.xml, /default="Flow_Rejected"/);
    assert.match(result.xml, /bpmndi:BPMNShape/);
    assert.match(result.xml, /bpmndi:BPMNEdge/);
    assert(!result.xml.includes("candidateUsers"));
    assert(!result.xml.includes("assignee="));
});
test("broken, disconnected and ambiguous graphs fail before any draft XML is produced", () => {
    for (const mutate of [
        (spec) => spec.steps.push(spec.steps[0]),
        (spec) => (spec.transitions[0].targetId = "Missing"),
        (spec) => (spec.transitions[3].defaultRoute = false),
        (spec) => (spec.transitions[2].condition = "${api.call()}"),
        (spec) => spec.steps.push(step("Detached", "end")),
        (spec) => (spec.transitions[3].targetId = "Start"),
        (spec) => (spec.steps[1].formVersionId = null),
    ]) {
        const spec = specification();
        mutate(spec);
        assert.throws(() => compileAiBpmnSpecification(spec, "ai_preview_fixture"), AiBpmnCompilationError);
    }
});
test("wire fields cannot supply deployment, identities, engine script tasks or a process key", () => {
    for (const mutate of [
        (spec) => (spec.deploy = true),
        (spec) => (spec.processKey = "invented"),
        (spec) => (spec.steps[1].kind = "scriptTask"),
        (spec) =>
            (spec.steps[1].definitionJson = JSON.stringify({
                version: 3,
                formId: 12,
                contextPath: "survey",
                eligibility: { anyOf: [{ roleKeys: ["engineer"] }] },
            })),
        (spec) => (spec.metadataJson = '{"__proto__":{"admin":true}}'),
    ]) {
        const spec = specification();
        mutate(spec);
        assert.throws(() => compileAiBpmnSpecification(spec, "ai_preview_fixture"), AiBpmnCompilationError);
    }
    assert.throws(() => compileAiBpmnSpecification(specification(), '<process id="x">'), AiBpmnCompilationError);
});
module.exports = { specification };
