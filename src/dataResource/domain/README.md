# DataResource domain notes

This domain contains only shared, serializable contracts. Resource execution,
status, caching, request identity, and component behavior belong to consuming
runtimes rather than this package.

Editable FormMaker field-value ownership is intentionally **not** modeled here
for this batch. The supplied shared source has no cross-repository persisted
consumer that requires an `initial | computed` ownership contract. If FormMaker
needs that distinction, it should remain in the at-platform/FormMaker schema
until a real shared consumer justifies moving the small mode union here.
