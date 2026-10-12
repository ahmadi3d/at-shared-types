import type { AtJsonObject } from "../../core/domain/json.types";
import type { WorkflowAutomationDefinitionV2 } from "../../workflow/domain/model";
import {
    deriveWorkflowTaskCandidateGroups,
    normalizeWorkflowUserTaskDefinitionV4,
} from "../../workflow/protocol/task-policy";
import { parseWorkflowRouteCondition } from "../../workflow/protocol/route-condition";
import type { AiBpmnSpecification, AiBpmnStep } from "../domain/bpmn-authoring";
import { AiBpmnSpecificationSchema } from "../protocol/bpmn-authoring";
import { validateAiProtocol } from "../protocol/platform-validation";

export class AiBpmnCompilationError extends Error {
    constructor(
        readonly code: string,
        readonly path: string,
    ) {
        super(code);
        this.name = "AiBpmnCompilationError";
    }
}
const fail = (code: string, path: string): never => {
    throw new AiBpmnCompilationError(code, path);
};
const escapeXml = (value: string): string => {
    if (/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) return fail("AI_BPMN_XML_TEXT", "");
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        .replace(/\r/g, "&#13;")
        .replace(/\n/g, "&#10;");
};
const jsonObject = (text: string, path: string): AtJsonObject => {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch {
        return fail("AI_BPMN_DEFINITION_JSON", path);
    }
    if (!value || typeof value !== "object" || Array.isArray(value)) return fail("AI_BPMN_DEFINITION_JSON", path);
    const inspect = (item: unknown, depth = 0): void => {
        if (depth > 20) fail("AI_BPMN_DEFINITION_JSON", path);
        if (!item || typeof item !== "object") return;
        for (const [key, child] of Object.entries(item)) {
            if (["__proto__", "constructor", "prototype"].includes(key)) fail("AI_BPMN_DEFINITION_JSON", path);
            inspect(child, depth + 1);
        }
    };
    inspect(value);
    return value as AtJsonObject;
};
const element = (
    tag: string,
    attributes: Record<string, string | number | boolean | undefined>,
    children?: string[],
): string => {
    const fields = Object.entries(attributes)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => ` ${key}="${escapeXml(String(value))}"`)
        .join("");
    return children === undefined ? `<${tag}${fields}/>` : `<${tag}${fields}>${children.join("\n")}</${tag}>`;
};
const extension = (type: string, definition: unknown) =>
    element("bpmn:extensionElements", {}, [element(`at:${type}`, { json: JSON.stringify(definition) })]);
const tags: Record<AiBpmnStep["kind"], string> = {
    start: "startEvent",
    end: "endEvent",
    "user-task": "userTask",
    automation: "serviceTask",
    "exclusive-gateway": "exclusiveGateway",
    "parallel-gateway": "parallelGateway",
};

/** Pure deterministic XML/DI compiler. Native backend validation still resolves catalogs, forms and scripts. */
export function compileAiBpmnSpecification(input: unknown, processKey: string) {
    const parsed = validateAiProtocol<AiBpmnSpecification>(AiBpmnSpecificationSchema, input);
    if (parsed.status !== "valid") return fail("AI_BPMN_SPECIFICATION_INVALID", "");
    const spec = parsed.value;
    if (!spec.title.trim() || new TextEncoder().encode(JSON.stringify(spec)).length > 48000)
        return fail("AI_BPMN_SPECIFICATION_INVALID", "");
    if (!/^(?:at_model_[a-f0-9]{32}|ai_preview_[A-Za-z0-9_]{1,40})$/.test(processKey))
        return fail("AI_BPMN_PROCESS_KEY", "");
    const nodes = new Map(spec.steps.map((step) => [step.id, step]));
    if (nodes.size !== spec.steps.length) return fail("AI_BPMN_DUPLICATE_STEP", "steps");
    if (new Set(spec.transitions.map((flow) => flow.id)).size !== spec.transitions.length)
        return fail("AI_BPMN_DUPLICATE_FLOW", "transitions");
    const starts = spec.steps.filter((step) => step.kind === "start"),
        ends = spec.steps.filter((step) => step.kind === "end");
    if (starts.length !== 1 || !ends.length) return fail("AI_BPMN_START_END", "steps");
    const incoming = (id: string) => spec.transitions.filter((flow) => flow.targetId === id);
    const outgoing = (id: string) => spec.transitions.filter((flow) => flow.sourceId === id);
    for (const flow of spec.transitions) {
        const source = nodes.get(flow.sourceId),
            target = nodes.get(flow.targetId);
        if (!source || !target || source.kind === "end" || target.kind === "start" || source === target)
            return fail("AI_BPMN_FLOW_REFERENCE", flow.id);
        const conditionalSource = ["user-task", "automation", "exclusive-gateway"].includes(source.kind);
        if (
            flow.condition !== null &&
            (!conditionalSource || flow.defaultRoute || !parseWorkflowRouteCondition(flow.condition))
        )
            return fail("AI_BPMN_CONDITION", flow.id);
        if (flow.defaultRoute && !conditionalSource) return fail("AI_BPMN_DEFAULT_ROUTE", flow.id);
    }
    for (const step of spec.steps) {
        const next = outgoing(step.id),
            defaults = next.filter((flow) => flow.defaultRoute);
        if (
            defaults.length > 1 ||
            (step.kind !== "end" && !next.length) ||
            (step.kind !== "start" && !incoming(step.id).length)
        )
            return fail("AI_BPMN_DISCONNECTED_STEP", step.id);
        if (next.length === 1 && next[0].condition !== null) return fail("AI_BPMN_AMBIGUOUS_ROUTE", step.id);
        if (
            next.length > 1 &&
            step.kind !== "parallel-gateway" &&
            (defaults.length !== 1 || next.some((flow) => !flow.defaultRoute && flow.condition === null))
        )
            return fail("AI_BPMN_AMBIGUOUS_ROUTE", step.id);
    }
    const reachable = (seeds: string[], reverse: boolean): Set<string> => {
        const visited = new Set(seeds),
            pending = [...seeds];
        while (pending.length) {
            const id = pending.shift()!;
            for (const flow of reverse ? incoming(id) : outgoing(id)) {
                const next = reverse ? flow.sourceId : flow.targetId;
                if (!visited.has(next)) {
                    visited.add(next);
                    pending.push(next);
                }
            }
        }
        return visited;
    };
    if (
        reachable([starts[0].id], false).size !== nodes.size ||
        reachable(
            ends.map((step) => step.id),
            true,
        ).size !== nodes.size
    )
        return fail("AI_BPMN_UNREACHABLE_STEP", "steps");
    const forms: { bpmnElementId: string; formId: number; formVersionId: number }[] = [];
    const xmlNodes = spec.steps.map((step) => {
        const id = `Node_${step.id}`,
            tag = tags[step.kind];
        const defaults = outgoing(step.id).find((flow) => flow.defaultRoute);
        const attributes: Record<string, string | undefined> = {
            id,
            name: step.name,
            default: defaults ? `Flow_${defaults.id}` : undefined,
        };
        let configXml = "",
            loop = "";
        if (step.kind === "user-task") {
            const raw = step.definitionJson ? jsonObject(step.definitionJson, step.id) : null;
            const definition = normalizeWorkflowUserTaskDefinitionV4(raw);
            if (
                !definition ||
                !step.formVersionId ||
                !/^[1-9][0-9]{0,9}$/.test(String(definition.formId)) ||
                Number(definition.formId) > 2147483647
            )
                return fail("AI_BPMN_TASK_V4_REQUIRED", step.id);
            forms.push({ bpmnElementId: id, formId: Number(definition.formId), formVersionId: step.formVersionId });
            attributes["flowable:candidateGroups"] = deriveWorkflowTaskCandidateGroups(definition.eligibility).join(
                ",",
            );
            configXml = extension("TaskData", definition);
            if (definition.multiInstance) {
                const mi = definition.multiInstance;
                loop = element("bpmn:multiInstanceLoopCharacteristics", {
                    isSequential: mi.sequential,
                    "flowable:collection": "${atContext." + mi.collectionPath + "}",
                    "flowable:elementVariable": mi.itemVariable,
                    "flowable:elementIndexVariable": mi.indexVariable,
                });
            }
        } else if (step.kind === "automation") {
            if (step.formVersionId !== null || step.definitionJson === null)
                return fail("AI_BPMN_AUTOMATION_V2_REQUIRED", step.id);
            const definition = jsonObject(step.definitionJson, step.id);
            const execution = definition.execution as AtJsonObject | undefined,
                config = execution?.config as AtJsonObject | undefined;
            if (
                Object.keys(definition).some((key) => !["version", "execution"].includes(key)) ||
                definition.version !== 2 ||
                execution?.mode !== "script" ||
                Object.keys(execution).some((key) => !["mode", "config"].includes(key)) ||
                !config ||
                config.language !== "javascript" ||
                config.apiVersion !== 2 ||
                typeof config.source !== "string" ||
                Object.keys(config).some(
                    (key) => !["language", "apiVersion", "source", "routineReferences"].includes(key),
                )
            )
                return fail("AI_BPMN_AUTOMATION_V2_REQUIRED", step.id);
            const normalized = definition as unknown as WorkflowAutomationDefinitionV2;
            attributes["flowable:type"] = "external-worker";
            attributes["flowable:topic"] = "at.workflow.script.v2";
            configXml = extension("AutomationData", normalized);
        } else if (step.definitionJson !== null || step.formVersionId !== null)
            return fail("AI_BPMN_UNEXPECTED_DEFINITION", step.id);
        const refs = incoming(step.id)
            .map((flow) => `<bpmn:incoming>Flow_${flow.id}</bpmn:incoming>`)
            .concat(outgoing(step.id).map((flow) => `<bpmn:outgoing>Flow_${flow.id}</bpmn:outgoing>`))
            .join("");
        return element(`bpmn:${tag}`, attributes, [configXml, refs, loop]);
    });
    const xmlFlows = spec.transitions.map((flow) =>
        element(
            "bpmn:sequenceFlow",
            {
                id: `Flow_${flow.id}`,
                sourceRef: `Node_${flow.sourceId}`,
                targetRef: `Node_${flow.targetId}`,
                name: flow.name,
            },
            flow.condition === null
                ? []
                : [
                      element("bpmn:conditionExpression", { "xsi:type": "bpmn:tFormalExpression" }, [
                          escapeXml(flow.condition),
                      ]),
                  ],
        ),
    );
    // Place successors by graph depth, with separate rows for branches at the same depth.
    // Input order alone would place acceptance/rejection on one line and route through an end event.
    const depths = new Map<string, number>([[starts[0].id, 0]]);
    const pending = [starts[0].id];
    while (pending.length) {
        const source = pending.shift()!;
        for (const flow of outgoing(source)) {
            if (depths.has(flow.targetId)) continue;
            depths.set(flow.targetId, depths.get(source)! + 1);
            pending.push(flow.targetId);
        }
    }
    const rows = new Map<number, number>();
    const bounds = new Map(
        spec.steps.map((step) => {
            const depth = depths.get(step.id)!;
            const row = rows.get(depth) ?? 0;
            rows.set(depth, row + 1);
            const task = ["user-task", "automation"].includes(step.kind);
            const width = task ? 150 : step.kind.endsWith("gateway") ? 50 : 36;
            const height = task ? 80 : step.kind.endsWith("gateway") ? 50 : 36;
            return [
                step.id,
                { x: 220 + depth * 260 + (150 - width) / 2, y: 180 + row * 160 + (80 - height) / 2, width, height },
            ];
        }),
    );
    const shapes = spec.steps.map((step) => {
        const b = bounds.get(step.id)!;
        return element("bpmndi:BPMNShape", { id: `Shape_${step.id}`, bpmnElement: `Node_${step.id}` }, [
            element("dc:Bounds", b),
        ]);
    });
    const edges = spec.transitions.map((flow, index) => {
        const source = bounds.get(flow.sourceId)!,
            target = bounds.get(flow.targetId)!;
        const x1 = source.x + source.width,
            y1 = source.y + source.height / 2,
            x2 = target.x,
            y2 = target.y + target.height / 2;
        const detour = Math.max(...[...bounds.values()].map((value) => value.y + value.height)) + 60 + index * 12;
        const middle = (x1 + x2) / 2;
        const points =
            x2 <= x1
                ? [
                      [x1, y1],
                      [x1 + 30, y1],
                      [x1 + 30, detour],
                      [x2 - 30, detour],
                      [x2 - 30, y2],
                      [x2, y2],
                  ]
                : y1 === y2
                  ? [
                        [x1, y1],
                        [x2, y2],
                    ]
                  : [
                        [x1, y1],
                        [middle, y1],
                        [middle, y2],
                        [x2, y2],
                    ];
        return element(
            "bpmndi:BPMNEdge",
            { id: `Edge_${flow.id}`, bpmnElement: `Flow_${flow.id}` },
            points.map(([x, y]) => element("di:waypoint", { x, y })),
        );
    });
    const process = element("bpmn:process", { id: processKey, name: spec.title, isExecutable: true }, [
        element("bpmn:documentation", {}, [escapeXml(spec.description)]),
        extension("ProcessData", { version: 2, globalActions: [] }),
        ...xmlNodes,
        ...xmlFlows,
    ]);
    const diagram = element("bpmndi:BPMNDiagram", { id: `Diagram_${processKey}` }, [
        element("bpmndi:BPMNPlane", { id: `Plane_${processKey}`, bpmnElement: processKey }, [...shapes, ...edges]),
    ]);
    const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        element(
            "bpmn:definitions",
            {
                "xmlns:bpmn": "http://www.omg.org/spec/BPMN/20100524/MODEL",
                "xmlns:at": "http://bpms.bp.net/schema/workflow/2.0",
                "xmlns:flowable": "http://flowable.org/bpmn",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xmlns:bpmndi": "http://www.omg.org/spec/BPMN/20100524/DI",
                "xmlns:dc": "http://www.omg.org/spec/DD/20100524/DC",
                "xmlns:di": "http://www.omg.org/spec/DD/20100524/DI",
                id: `Definitions_${processKey}`,
                targetNamespace: "http://bpms.bp.net/schema/workflow/2.0",
            },
            [process, diagram],
        );
    if (new TextEncoder().encode(xml).length > 256000) return fail("AI_BPMN_XML_LIMIT", "");
    return {
        xml,
        title: spec.title,
        description: spec.description,
        forms,
        metadata: spec.metadataJson === null ? null : jsonObject(spec.metadataJson, "metadataJson"),
    };
}
