# Lab 00 Cheat Sheet

Lab ID: `00`

## What the working answer is

Lab 00 is the starter scaffold checkpoint.

Students should be able to:

- run `pnpm dev`
- open the issuer and verifier landing pages
- fetch issuer metadata
- see `501 Not Implemented` from the unfinished lesson routes

There is no final integrated code to hand out for Lab 00. The correct answer is the starter scaffold itself.

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 00 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm lab:check -- --lab 00 --start --verbose
```

This restores the starter overrides for:

- `issuer/src/index.ts`
- `verifier/src/index.ts`

## What students should see

- `GET /.well-known/openid-credential-issuer` returns JSON
- `POST /credential-offers` returns `501`
- `POST /token` returns `501`
- `POST /credential` returns `501`
- `POST /verify` returns `501`

## What to tell students

- Lab 00 is setup and orientation, not implementation.
- The main files to inspect are `issuer/src/index.ts`, `verifier/src/index.ts`, and `bbs-lib/src/index.ts`.
- Do not start with wallet code or `demo-conductor/`.
