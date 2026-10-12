const { test } = require("node:test");
const assert = require("node:assert/strict");
const { compileAiApiSpecification, previewAiApiSpecification, AiApiCompilationError } = require("../dist/protocol.cjs");
const catalog = {
    profiles: {
        public: { origin: "https://example.test", basePath: "/v1", allowedMethods: [1, 2], revision: "approved:7" },
    },
};
const spec = () => ({
    schemaVersion: 1,
    title: "Customer API",
    description: "Public fixture",
    connectionProfileId: "public",
    httpMethodId: 2,
    endpointPath: "/v1/customers",
    parameters: [{ name: "page", example: "1", description: "Public paging example" }],
    bodyFields: [{ name: "name", type: "string", example: "Sample", required: true }],
    responseMappings: [{ name: "id", sourcePointer: "/data/0/id", type: "integer", required: true }],
    postScript: null,
});
const rejects = (input, code) =>
    assert.throws(
        () => compileAiApiSpecification(input, catalog),
        (error) => error instanceof AiApiCompilationError && error.issues.some((issue) => issue.code === code),
    );
test("native API compilation produces an unpublished editable definition without credentials and preserves inputs", () => {
    const input = spec(),
        before = structuredClone(input),
        compiled = compileAiApiSpecification(input, catalog);
    assert.equal(compiled.definition.authoring.state, "draft");
    assert.equal(compiled.definition.config.http_method_id, 2);
    assert.equal(compiled.definition.config.url, "https://example.test/v1/customers");
    assert.deepEqual(compiled.definition.config.params, [
        { key: "page", value: "1", description: "Public paging example" },
    ]);
    assert.equal(compiled.definition.config.body.api_body_type_id, 4);
    assert.deepEqual(JSON.parse(compiled.definition.config.body.raw), { name: "Sample" });
    assert.deepEqual(compiled.definition.config.authorization, { api_authorization_type_id: 1 });
    assert.deepEqual(input, before);
});
test("endpoint/profile authority cannot be supplied or bypassed by model input", () => {
    rejects({ ...spec(), url: "https://evil.test" }, "AI_API_SPEC_INVALID");
    rejects({ ...spec(), profiles: catalog.profiles }, "AI_API_SPEC_INVALID");
    rejects({ ...spec(), connectionProfileId: "absent" }, "AI_API_CONNECTION_PROFILE_UNAVAILABLE");
    rejects({ ...spec(), httpMethodId: 4 }, "AI_API_ENDPOINT_NOT_APPROVED");
    for (const endpointPath of [
        "//evil.test/v1",
        "/v10/customer",
        "/v1/../private",
        "/v1/%2e%2e/private",
        "/v1/customer?token=secret",
        "/v1/customer#secret",
        "javascript:alert(1)",
    ])
        rejects({ ...spec(), endpointPath }, "AI_API_ENDPOINT_NOT_APPROVED");
});
test("semantic native fields reject ambiguous names, examples, GET bodies and unsafe response selectors", () => {
    rejects({ ...spec(), parameters: [...spec().parameters, ...spec().parameters] }, "AI_API_NAME_INVALID");
    rejects(
        { ...spec(), bodyFields: [{ name: "constructor", type: "string", example: "x", required: true }] },
        "AI_API_NAME_INVALID",
    );
    rejects(
        { ...spec(), bodyFields: [{ name: "age", type: "integer", example: 1.5, required: true }] },
        "AI_API_EXAMPLE_TYPE_INVALID",
    );
    rejects({ ...spec(), httpMethodId: 1 }, "AI_API_GET_BODY_UNSUPPORTED");
    for (const sourcePointer of ["data.id", "/constructor/id", "/data/__proto__", "/data/~2bad"])
        rejects(
            { ...spec(), responseMappings: [{ name: "id", sourcePointer, type: "string", required: true }] },
            "AI_API_RESPONSE_POINTER_INVALID",
        );
});
test("mock preview maps actual fixture paths and reports missing/type failures while proposed code stays inert", () => {
    const input = {
        ...spec(),
        postScript: 'globalThis.__apiScriptRan = true; throw new Error("unsafe");',
        responseMappings: [
            ...spec().responseMappings,
            { name: "optional", sourcePointer: "/absent", type: "string", required: false },
            { name: "title", sourcePointer: "/title", type: "string", required: true },
            { name: "escaped", sourcePointer: "/a~1b/~0key", type: "boolean", required: true },
        ],
    };
    const output = previewAiApiSpecification(input, catalog, {
        contractVersion: 20,
        data: [{ id: 7 }],
        title: 4,
        "a/b": { "~key": true },
    });
    assert.deepEqual(output.response, { id: 7, escaped: true });
    assert.equal(output.request.method, "POST");
    assert.deepEqual(output.request.body, { name: "Sample" });
    assert.equal(output.scriptExecuted, false);
    assert.equal(globalThis.__apiScriptRan, undefined);
    assert(
        output.issues.some(
            (issue) => issue.code === "AI_API_RESPONSE_TYPE_INVALID" && issue.path === "/responseMappings/2",
        ),
    );
    assert(output.issues.some((issue) => issue.code === "AI_API_SCRIPT_REVIEW_REQUIRED"));
    assert(
        previewAiApiSpecification(spec(), catalog, {}).issues.some(
            (issue) => issue.code === "AI_API_RESPONSE_VALUE_MISSING",
        ),
    );
});
test("mock input bounds reject accessors, serialization hooks, cycles and sparse/oversized arrays without executing hooks", () => {
    let invoked = 0;
    const getter = Object.defineProperty({}, "secret", {
        enumerable: true,
        get() {
            invoked++;
            return "private";
        },
    });
    const serializer = Object.defineProperty({}, "toJSON", {
        value() {
            invoked++;
            return {};
        },
    });
    const cycle = {};
    cycle.self = cycle;
    for (const sample of [
        getter,
        serializer,
        cycle,
        new Array(1),
        new Array(5000),
        { big: "x".repeat(48001) },
        [, , 3],
    ])
        assert.throws(
            () => previewAiApiSpecification(spec(), catalog, sample),
            (error) => error.issues[0].code === "AI_API_MOCK_RESPONSE_INVALID",
        );
    assert.equal(invoked, 0);
});
