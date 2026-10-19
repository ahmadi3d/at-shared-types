const assert = require("node:assert/strict");
const { createHash } = require("node:crypto");
const { test } = require("node:test");
const {
    AiIntegrationManifestSchema,
    compareAiPageIntegration,
    canonicalAiJson,
    canonicalAiPageContract,
    validateAiPageIntegration,
    validateAiIntegrationManifest,
    validateAiProtocol,
} = require("../dist/protocol.cjs");

const page = () => ({
    contractVersion: 1,
    pageId: "fixture-page",
    integrationVersion: 1,
    resourceType: "fixture",
    resourceSchemaVersion: 3,
    domainFingerprint: "a".repeat(64),
    context: { id: "fixture.context", version: 1, fingerprint: "b".repeat(64) },
    tools: [{ id: "fixture.read", version: 1 }],
    foregroundActions: [],
    knowledge: [],
    lifecycle: "active",
    owner: {
        frontend: "src/pages/Fixture/ai/integration.ts",
        backend: "src/app/ai/domains/fixture/integration.ts",
        schema: "src/pages/Fixture/model.ts",
        fixtures: ["src/pages/Fixture/ai/integration.test.ts"],
    },
});

test("closed page/manifest metadata never accepts executable authority or ambiguous IDs", () => {
    assert.ok(validateAiPageIntegration(page()));
    assert.equal(
        validateAiIntegrationManifest({
            contractVersion: 1,
            applicationId: "fixture",
            fingerprint: "a".repeat(64),
            pages: [page(), { ...page(), lifecycle: "deprecated" }],
        }),
        null,
    );
    assert.ok(
        validateAiIntegrationManifest({
            contractVersion: 1,
            applicationId: "fixture",
            fingerprint: "a".repeat(64),
            pages: [page(), { ...page(), integrationVersion: 2 }],
        }),
    );
    assert.equal(
        validateAiProtocol(AiIntegrationManifestSchema, {
            contractVersion: 1,
            applicationId: "fixture",
            fingerprint: "c".repeat(64),
            pages: [page()],
        }).status,
        "valid",
    );
    for (const value of [
        { ...page(), authorize: true },
        { ...page(), context: { ...page().context, loader: "arbitrary.js" } },
        { ...page(), owner: { ...page().owner, backend: "../private.ts" } },
        {
            ...page(),
            tools: [
                { id: "fixture.read", version: 1 },
                { id: "fixture.read", version: 2 },
            ],
        },
        {
            ...page(),
            foregroundActions: [
                {
                    id: "fixture.fill",
                    version: 1,
                    mode: "delegate",
                    risk: "modify",
                    undoable: false,
                    input: page().context,
                    output: page().context,
                },
            ],
        },
    ])
        assert.equal(validateAiPageIntegration(value), null);
});

test("schema and removed-action drift are explicit; current deprecated versions remain readable", () => {
    assert.deepEqual(compareAiPageIntegration(page(), page()), { status: "supported", deprecated: false });
    assert.equal(
        canonicalAiPageContract(page()),
        canonicalAiPageContract({
            ...page(),
            lifecycle: "deprecated",
            owner: { ...page().owner, schema: "src/pages/Fixture/renamed.ts" },
        }),
    );
    assert.deepEqual(compareAiPageIntegration(page(), { ...page(), lifecycle: "deprecated" }), {
        status: "supported",
        deprecated: true,
    });
    assert.equal(compareAiPageIntegration(page(), { ...page(), integrationVersion: 2 }).status, "unsupported_version");
    assert.equal(compareAiPageIntegration(page(), {
        ...page(), context: { ...page().context, fingerprint: "d".repeat(64) },
    }).status, "schema_drift");
    assert.equal(compareAiPageIntegration(page(), { ...page(), tools: [] }).status, "action_removed");
    assert.equal(
        compareAiPageIntegration(page(), {
            ...page(),
            knowledge: [{ id: "fixture.help", version: 1, fingerprint: "e".repeat(64) }],
        }).diagnostics[0].code,
        "AI_PAGE_KNOWLEDGE_DRIFT",
    );
});

test("source and knowledge provenance is advisory while every executable field remains strict", () => {
    const current = page();
    const provenance = {
        ...current,
        domainFingerprint: "d".repeat(64),
        knowledge: [{ id: "fixture.help", version: 2, fingerprint: "e".repeat(64) }],
    };
    const comparison = compareAiPageIntegration(current, provenance);
    assert.equal(comparison.status, "supported");
    assert.deepEqual(comparison.diagnostics.map(item => item.code), [
        "AI_PAGE_SOURCE_DRIFT", "AI_PAGE_KNOWLEDGE_DRIFT",
    ]);
    assert.match(comparison.diagnostics[0].repair, /fixture-page.*src\/pages\/Fixture/);
    assert.equal(canonicalAiPageContract(current), canonicalAiPageContract(provenance));
    assert.notEqual(canonicalAiPageContract(current, "legacy"), canonicalAiPageContract(provenance, "legacy"));
    const { owner: _owner, lifecycle: _lifecycle, ...oldPayload } = current;
    assert.equal(canonicalAiPageContract(current, "legacy"), canonicalAiJson(oldPayload),
        "Legacy verification must reproduce the former canonical payload exactly.");
    for (const changed of [
        { ...provenance, pageId: "another-page" },
        { ...provenance, integrationVersion: 2 },
        { ...provenance, resourceType: "another-resource" },
        { ...provenance, resourceSchemaVersion: 4 },
        { ...provenance, context: { ...current.context, version: 2 } },
        { ...provenance, context: { ...current.context, fingerprint: "f".repeat(64) } },
        { ...provenance, tools: [{ id: "fixture.read", version: 2 }] },
        { ...provenance, foregroundActions: [{
            id: "fixture.fill", version: 1, mode: "assist", risk: "transient", undoable: true,
            input: current.context, output: current.context,
        }] },
    ]) {
        assert.notEqual(compareAiPageIntegration(current, changed).status, "supported");
        assert.notEqual(canonicalAiPageContract(current), canonicalAiPageContract(changed));
    }
    assert.equal(compareAiPageIntegration(current, { ...provenance, domainFingerprint: "unknown" }).status, "invalid");
});

test("canonical fingerprints ignore object order and reject accessors before evaluation", () => {
    const hash = (value) => createHash("sha256").update(canonicalAiJson(value)).digest("hex");
    assert.equal(hash({ a: { d: 1, c: 2 }, b: [2, 1] }), hash({ b: [2, 1], a: { c: 2, d: 1 } }));
    assert.notEqual(hash({ a: "url" }), hash({ a: "endpoint" }));
    const value = {};
    Object.defineProperty(value, "credential", { enumerable: true, get: () => assert.fail("Getter was executed.") });
    assert.throws(() => canonicalAiJson(value), /AI_MANIFEST_JSON_INVALID/);
});
