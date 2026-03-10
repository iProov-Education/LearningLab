# Status store scaffold

## Why this exists

A Bitstring Status List encodes **revocation state**, not **allocation state**.

That means:

- bit = 0 → not revoked
- bit = 1 → revoked

A clear bit does **not** tell you whether an index was:
- never assigned, or
- assigned to an active credential that has not been revoked

So an allocator that scans for the first clear bit can accidentally hand out the same index to multiple active credentials.

## Safer pattern

Persist allocation state separately, for example in a sidecar file:

- `1.json` — the revocation bitstring
- `1.allocations.json` — the allocation ledger

That lets you:
- keep a monotonic `nextIndex`
- make allocation idempotent per `credentialId`
- revoke by index without changing the allocation ledger

## Included file

- `status-store.ts`

This is a drop-in scaffold showing one safe direction.
