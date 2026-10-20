const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateAtEvent, AtEventSchemas } = require('../dist/protocol.cjs');

const event = () => ({
    eventId: 'e9bb679f-32a9-4a83-9f81-c49f9be35c48',
    type: 'support.ticket.created',
    version: 1,
    occurredAt: '2026-10-20T10:00:00.000Z',
    source: 'parto-bpms-tci',
    correlationId: '838ae8d4-9506-4afd-a815-e250f878a94a',
    aggregate: { type: 'support.ticket', id: '12', revision: '1' },
    payload: { ticketId: '12' },
});

test('closed registry accepts all three minimal business facts and detached values', () => {
    assert.equal(Object.keys(AtEventSchemas).length, 3);
    const original = event();
    const result = validateAtEvent(original);
    assert.equal(result.status, 'valid');
    original.payload.ticketId = '50';
    assert.equal(result.value.payload.ticketId, '12');
    assert.equal(validateAtEvent({ ...event(), type: 'support.ticket.updated', payload: { ticketId: '12', changes: ['status', 'assignment'] } }).status, 'valid');
    assert.equal(validateAtEvent({ ...event(), type: 'support.ticket.activity.created', payload: { ticketId: '12', activityId: '100', visibility: 'internal' } }).status, 'valid');
});

test('unsupported event names and contract versions fail closed', () => {
    for (const type of ['whatever', '__proto__', 'constructor']) {
        assert.equal(validateAtEvent({ ...event(), type }).status, 'unsupported_type');
    }
    for (const version of [0, 2, '1', null]) {
        assert.equal(validateAtEvent({ ...event(), version }).status, 'unsupported_version');
    }
});

test('identities, timestamps, revisions and aggregate relationship are validated', () => {
    for (const patch of [
        { eventId: 'bad' }, { eventId: '00000000-0000-0000-0000-000000000000' },
        { correlationId: '12' }, { causationId: undefined },
        { occurredAt: '2026-02-30T10:00:00.000Z' }, { occurredAt: '2026-10-20T10:00:00+03:30' },
        { aggregate: { type: 'support.ticket', id: '13' } },
        { aggregate: { type: 'support.ticket', id: '12', revision: '0' } },
        { aggregate: { type: 'support.ticket', id: '9223372036854775808' } },
        { source: 'invalid\nsource' }, { source: 'a'.repeat(101) },
    ]) assert.equal(validateAtEvent({ ...event(), ...patch }).status, 'invalid');
    assert.equal(validateAtEvent({ ...event(), occurredAt: '2026-10-20T10:00:00Z' }).status, 'valid');
});

test('payloads cannot smuggle message bodies, arbitrary columns or transport/routing data', () => {
    for (const payload of [
        { ticketId: '12', body: 'secret' }, { ticketId: 12 }, { ticketId: '01' },
        { ticketId: '12', audience: ['1'] }, { ticketId: '12', streamId: '1-0' },
    ]) assert.equal(validateAtEvent({ ...event(), payload }).status, 'invalid');
    for (const changes of [[], ['status', 'status'], ['anything'], Array(1)]) {
        assert.equal(validateAtEvent({ ...event(), type: 'support.ticket.updated', payload: { ticketId: '12', changes } }).status, 'invalid');
    }
    assert.equal(validateAtEvent({ ...event(), audience: { kind: 'users', userIds: ['1'] } }).status, 'invalid');
});

test('unsafe, cyclic, accessor, oversized and non-JSON input is rejected without running accessors', () => {
    let accessed = false;
    const accessor = event();
    Object.defineProperty(accessor.payload, 'body', { enumerable: true, get() { accessed = true; throw Error('unsafe'); } });
    const cyclic = event();
    cyclic.payload.loop = cyclic;
    const inherited = Object.assign(Object.create({ type: 'support.ticket.created' }), event());
    const symbol = event();
    symbol[Symbol('hidden')] = 'hidden';
    for (const input of [accessor, cyclic, inherited, symbol, { ...event(), source: 'a'.repeat(9000) },
        { ...event(), payload: { ticketId: '12', unsafe: NaN } }, JSON.parse('{"__proto__":{}}')]) {
        assert.equal(validateAtEvent(input).status, 'invalid');
    }
    assert.equal(accessed, false);
});
