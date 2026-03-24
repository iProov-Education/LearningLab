# Lab 05 Cheat Sheet

Lab ID: `05`

## Working answer

The known-good implementation lives in:

- `issuer/src/index.ts`
- `verifier/src/index.ts`

For this lesson, the important pieces are:

- `GET /statuslist/:id.json`
- embedding `credentialStatus` during issuance
- checking the status bit during verification
- `POST /revoke/:id`

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 05 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm --filter status-list run generate
pnpm lab:check -- --lab 05 --start --verbose
```

If the student repo still has the generated `status-list/data/1.json`, the generate step is usually quick and harmless.

## What to emphasize when sharing the solution

- The issuer publishes the status list and writes the credential's index into `credentialStatus`.
- The verifier must actually decode the bitstring and check the correct bit.
- Most failures come from stale caches, a missing `ADMIN_TOKEN`, or never reading the status bit at all.

## Manual smoke test

1. Issue a credential.
2. Verify it once successfully.
3. Revoke it:

```bash
curl -s -X POST http://localhost:3001/revoke/<credentialId> \
  -H 'x-admin-token: <ADMIN_TOKEN>' | jq
```

4. Verify it again and confirm it now fails.

## Extra code already present in main

Ignore these while explaining Lab 05:

- wallet RP flow
- optional mobile integration
- demo-conductor-specific behavior
