const assert = require('node:assert/strict');
const { test } = require('node:test');
const { AiNoteSchema, AiNoteCommandSchema, AiConversationSchema, validateAiProtocol } = require('../dist/protocol.cjs');
const id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const command = { contractVersion: 1, id, traceId: id, commandId: id, title: 'Private', text: '', pinned: false };
const pageContext = { pageId: 'form-maker', integrationVersion: 1, resource: { resourceType: 'form', resourceId: '1', revision: '2', schemaVersion: 1 } };
test('private notes have closed chat or permitted resource associations', () => {
    for (const association of [undefined, { conversationId: id }, { pageContext }]) {
        assert.equal(validateAiProtocol(AiNoteCommandSchema, { ...command, ...(association ? { association } : {}) }).status, 'valid');
    }
    for (const value of [
        { ...command, owner: id }, { ...command, pinned: 'true' }, { ...command, title: '' },
        { ...command, association: { conversationId: id, pageContext } },
        { ...command, association: { pageContext: { ...pageContext, editorRevision: '1' } } },
        { ...command, association: { pageContext: { ...pageContext, data: { secret: true } } } },
        { ...command, text: 'x'.repeat(16001) },
    ]) assert.equal(validateAiProtocol(AiNoteCommandSchema, value).status, 'invalid');
});
test('note display metadata and conversation archive flag validate without executable context', () => {
    const date = '2026-10-11T00:00:00Z';
    const row = { id, title: 'Private', text: 'Stored', pinned: true, revision: '2', createdAt: date, updatedAt: date };
    assert.equal(validateAiProtocol(AiNoteSchema, row).status, 'valid');
    assert.equal(validateAiProtocol(AiNoteSchema, { ...row, sendToModel: true }).status, 'invalid');
    assert.equal(validateAiProtocol(AiConversationSchema, { id, title: 'Chat', mode: 'ask', archived: true, revision: '2', createdAt: date, updatedAt: date }).status, 'valid');
});
