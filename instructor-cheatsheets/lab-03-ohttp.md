# Lab 03 Cheat Sheet

Lab ID: `03`

## Working answer

The known-good implementation lives in:

- `issuer/src/index.ts`
- `verifier/src/index.ts`

The real lesson behavior is mostly in the verifier fetch helper plus env wiring:

- `USE_OHTTP=true`
- `OHTTP_RELAY_URL=<relay-url>`

## Fast-forward a blocked repo

From the instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 03 --target /absolute/path/to/student-repo
```

Then in the student repo:

```bash
pnpm lab:check -- --lab 03 --start --verbose
```

That is the quickest recovery path because the Lab 03 checker starts the local relay stub automatically.

## Manual env fallback

If you want students to see the manual route as well, set this in both `issuer/.env` and `verifier/.env`:

```dotenv
USE_OHTTP=true
OHTTP_RELAY_URL=http://127.0.0.1:8787
```

Then restart `pnpm dev`.

## What to emphasize when sharing the solution

- This lab is mostly wiring, not new credential logic.
- The verifier should route outbound fetches through the relay when the flag is on.
- The local lab checker is enough; students do not need a real deployed Cloudflare relay for class.

## Extra code already present in main

Ignore these while explaining Lab 03:

- wallet RP flow
- live iProov behavior
- the rest of the integrated revocation path
