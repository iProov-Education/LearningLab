# Lab 01 Cheat Sheet

Lab ID: `01`

## Working answer

The known-good implementation lives in the integrated instructor repo versions of:

- `issuer/src/index.ts`
- `verifier/src/index.ts`

For this lesson, the important pieces are:

- issuer signing key generation and `/.well-known/jwks.json`
- `POST /credential-offers`
- `POST /token`
- `POST /credential` for `vc+sd-jwt`
- verifier `POST /verify` for SD-JWT

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 01 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm lab:check -- --lab 01 --start --verbose
```

## What to emphasize when sharing the solution

- The copied files come from the integrated repo, so they already contain later-lab features too.
- For Lab 01, students should focus only on the SD-JWT path.
- Verify with `LAB_ID=01` or the Lab 01 checker so later-lab behavior does not distract from the result.

## Manual smoke test

```bash
curl -s -X POST http://localhost:3001/credential-offers \
  -H 'content-type: application/json' \
  -d '{"credentials":["AgeCredential"]}' | jq
```

```bash
curl -s -X POST http://localhost:3001/token \
  -H 'content-type: application/json' \
  -d '{"grant_type":"urn:ietf:params:oauth:grant-type:pre-authorized_code","pre-authorized_code":"<code>"}' | jq
```

Then request the SD-JWT credential and verify it as described in `labs/README-lab-01-issuance.md`.

## Extra code already present in main

Ignore these while explaining Lab 01:

- BBS support
- iProov gating
- status-list revocation
- wallet RP endpoints
