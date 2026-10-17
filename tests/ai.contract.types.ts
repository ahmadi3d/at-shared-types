import type { AiMessageCommandDto, AiStreamEventDto, AiToolProposalDto } from "../src/domain";
import type { AiMessageCommandWireDto, AiToolProposalWireDto } from "../src/transport";

const guid = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const command: AiMessageCommandDto = {
    contractVersion: 1,
    id: guid,
    traceId: guid,
    commandId: guid,
    conversationId: guid,
    expectedRevision: "1",
    mode: "ask",
    text: "Explain this page",
    pageContext: { pageId: "api-integration", integrationVersion: 1 },
};
const wire: AiMessageCommandWireDto = {
    contract_version: 1,
    id: guid,
    trace_id: guid,
    command_id: guid,
    conversation_id: guid,
    expected_revision: "1",
    mode: "ask",
    text: "Explain this page",
};
const proposal: AiToolProposalDto = {
    contractVersion: 1,
    id: guid,
    traceId: guid,
    toolCallId: guid,
    stepId: guid,
    toolId: "form.create-draft",
    toolVersion: 1,
    input: { schemaId: "form.draft-input", schemaVersion: 1, payload: { formTitle: "Example" } },
};
const proposalWire: AiToolProposalWireDto = {
    contract_version: 1,
    id: guid,
    trace_id: guid,
    tool_call_id: guid,
    step_id: guid,
    tool_id: "form.create-draft",
    tool_version: 1,
    input: { schema_id: "form.draft-input", schema_version: 1, payload: { formTitle: "Example" } },
};
const event: AiStreamEventDto = {
    contractVersion: 1,
    id: guid,
    traceId: guid,
    conversationId: guid,
    sequence: "1",
    occurredAt: "2026-10-10T12:00:00Z",
    kind: "message.delta",
    data: { messageId: guid, text: "Hello" },
};

const unsafeCommand: AiMessageCommandDto = {
    ...command,
    // @ts-expect-error Raw page state is outside the stable page integration envelope.
    pageContext: { pageId: "api-integration", integrationVersion: 1, data: { password: "private" } },
};
const unsupportedVersion: AiMessageCommandDto = {
    ...command,
    // @ts-expect-error The top-level protocol requires an explicit migration for new versions.
    contractVersion: 2,
};
const invalidEvent: AiStreamEventDto = {
    ...event,
    // @ts-expect-error Event kind determines the payload type.
    data: { jobId: guid, state: "queued" },
};
void [wire, proposal, proposalWire, unsafeCommand, unsupportedVersion, invalidEvent];
