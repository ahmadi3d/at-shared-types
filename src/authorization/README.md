# Security contracts v3

This is a deliberate breaking package release from 2.0.0 to 3.0.0. Build shared
first, then backend, then the shared at-platform consumer and BPMS host. Backend
uses its local file dependency; BPMS's existing pnpm override links the same local
package. A published consumer requires the matching v3 package before deployment.
No npm publish or repository commit is part of this implementation.

## Separate identity and authority

AtAuthUserDto/AtAuthSessionDto and provider token/login DTOs contain identity/profile
and token/session data. Adapters project known identity fields and discard issuer
privilege extras. AtIdentityPrincipalDto and AtIdentityTokenClaimsDto are the
canonical internal A5 session/JWT contracts, independent of external provider IDs.
Provider mapping alone does not validate a canonical revocable session.

AtAuthorizationMeDto is a separately retrieved frontend UX snapshot. Its stable
permission keys support can/canAny/canAll. Regional scopes contain only directly
assigned roots and descendant flags; the frontend has no authoritative descendant
proof. Backend requests reload/check authoritative revision/session/scope through
AtAuthorizationManager and transactional SQL predicates. A snapshot or version tag
from a browser/token is never backend proof.

SQL BIGINT telecom IDs, graph/user revisions and counts cross JSON as decimal
strings. Numeric permission/role IDs remain ordinary SQL INT relations. No unsafe
Number coercion may round a telecom identity. Authority GUID remains stable through
ordinary deployment and changes only with a new authority dataset.

## Declarative registry

RegisteredRoutineSecurityMetadata has an explicit version, context allowlist,
permission or reviewed authenticated exception, named scope policy and fixed input
bindings. Missing metadata/context/permission fails closed. Workflow-system entries
require permission mode and an authoring reference capability so publishing cannot
mint a privilege merely by naming a routine. These JSON schemas validate shape;
backend code registries must also resolve each name/source and enforce authority.

Post actions use the closed handlers, enum reference keys, safe scalar sources and
version 1 envelope. Unknown handlers/fields/versions fail validation. Sources name
flat validated parameters, bounded result recordsets/columns, trusted actor or
literal scalar values; there is no script/module/SQL/expression source. Bind safe
IDs once in the committing transaction, persist AtPostActionDispatchDto with a
bound action, and dispatch idempotently after commit. Never serialize whole inputs,
results, credentials or a second copy of tokens into delivery/audit state.

## References and workflow

AtSecurityCatalogItemDto structurally matches existing enum/Cascade item shapes
and preserves stable key, parentId and scope metadata. Telecom uses the separate
lazy paged tree/search DTOs; discovery grants no reach. Manager effective explanation
is distinct from /authorization/me and includes role sources, direct INHERIT/ALLOW/
DENY and disabled reasons. No manager UI is included here.

Workflow group IDs use role:<stable key>. Model engine/publication/instance GUIDs
are durable identities; Flowable definition IDs are opaque. Start policy metadata
is server-owned; A11 wires customer-derived, checked explicit-unit or reviewed global
scope and preserves active instance snapshots across later customer transfers.

## Runtime sequence

A4 guards fail closed when the server authorization snapshot is absent. A5 installs
canonical users/credentials/revocable sessions; A6 supplies the authoritative
snapshot/cache manager; A8 unifies routine execution; A10/A11 map authoring/runtime
policies; A12 supplies the adapter-independent frontend authority lifecycle. Keep
application traffic in the documented maintenance boundary until these gates pass.
