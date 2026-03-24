# Lab 04 Cheat Sheet

Lab ID: `04`

## Working answer

The known-good implementation lives in:

- `issuer/src/index.ts`
- `verifier/src/index.ts`

For this lesson, the important pieces are:

- `GET /iproov/claim`
- `POST /iproov/webhook`
- storing session state in memory
- blocking the protected flow until the session is passed

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 04 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm lab:check -- --lab 04 --start --verbose
```

## What to emphasize when sharing the solution

- The integrated repo normally uses a later BBS-verification-time gate.
- `LAB_ID=04` restores issuance-time gating on purpose so the lesson can focus on liveness in isolation.
- Students do not need real iProov credentials for the core lesson. The demo webhook path is enough.

## Manual smoke test

```bash
curl -s http://localhost:3001/iproov/claim | jq
```

Try the protected flow once before the webhook, then mark the session passed with:

```bash
curl -s -X POST http://localhost:3001/iproov/webhook \
  -H 'content-type: application/json' \
  -d '{"session":"<session>","signals":{"matching":{"passed":true}}}' | jq
```

Retry the protected flow and confirm it succeeds.

## Extra code already present in main

Ignore these while explaining Lab 04:

- wallet-mobile helpers such as `/iproov/mobile/claim`
- verifier wallet RP endpoints
- final integrated revocation logic outside the lesson focus
