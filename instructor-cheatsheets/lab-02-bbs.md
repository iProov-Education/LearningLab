# Lab 02 Cheat Sheet

Lab ID: `02`

## Working answer

The known-good implementation lives in:

- `issuer/src/index.ts`
- `verifier/src/index.ts`
- `bbs-lib/src/index.ts`

For this lesson, the important pieces are:

- `AgeCredentialBBS` support in the issuer
- the `di-bbs` credential branch in `POST /credential`
- `POST /bbs/proof`
- verifier-side BBS proof verification

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 02 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm lab:check -- --lab 02 --start --verbose
```

## What to emphasize when sharing the solution

- The message order is the fragile part. If the order changes, reveal indexes and proof verification break.
- The integrated repo can require iProov for BBS verification, but `LAB_ID=02` deliberately switches that off.
- This lesson is about selective disclosure, not liveness.

## Manual smoke test

- issue `AgeCredentialBBS`
- derive a proof that reveals only `age_over`
- verify that proof through `POST /verify`

Use the exact curl flow from `labs/README-lab-02-bbs.md`.

## Extra code already present in main

Ignore these while explaining Lab 02:

- the later iProov verification gate
- wallet RP endpoints
- revocation handling beyond keeping `credentialStatus` around
