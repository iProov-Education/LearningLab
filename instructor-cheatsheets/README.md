# Instructor Cheat Sheets

Instructor-only working answers for Labs 00-05.

This directory is intentionally excluded from both student-template builders:

- `scripts/scaffold-classroom-template.js`
- `learninglab-world-class-implementation-kit/overlays/instructor-repo/scripts/build-student-template.mjs`

That keeps the starter repo clean while still giving instructors and TAs a fast recovery path.

## What these files are for

Use them in two ways:

1. Hand out the answer after the live exercise.
2. Fast-forward a blocked student repo to the known-good implementation for that lab.

The per-lab markdown files are safe to paste into Google Classroom, a course site, or chat after the lesson.

## Fast-forward a blocked repo

From this instructor repo:

```bash
node scripts/fast-forward-student-lab.js --lab 01 --target /absolute/path/to/student-repo
```

Dry run first if you want to inspect the plan:

```bash
node scripts/fast-forward-student-lab.js --lab 01 --target /absolute/path/to/student-repo --dry-run
```

Then verify inside the student repo:

```bash
pnpm lab:check -- --lab 01 --start --verbose
```

Equivalent Classroom-style check:

```bash
LAB_ID=01 pnpm classroom:check
```

## Important model

- Lab 00 restores the starter scaffold from `starter-overrides/`.
- Labs 01-05 copy the current integrated working files from this instructor repo.
- Those integrated files already contain later-lab behavior, so always verify with the matching `LAB_ID` or `pnpm lab:check -- --lab XX`.

## Fast-forward map

| Lab | Files copied | Verify |
| --- | --- | --- |
| `00` | `issuer/src/index.ts`, `verifier/src/index.ts` from starter overrides | `pnpm lab:check -- --lab 00 --start --verbose` |
| `01` | `issuer/src/index.ts`, `verifier/src/index.ts` | `pnpm lab:check -- --lab 01 --start --verbose` |
| `02` | `issuer/src/index.ts`, `verifier/src/index.ts`, `bbs-lib/src/index.ts` | `pnpm lab:check -- --lab 02 --start --verbose` |
| `03` | `issuer/src/index.ts`, `verifier/src/index.ts` | `pnpm lab:check -- --lab 03 --start --verbose` |
| `04` | `issuer/src/index.ts`, `verifier/src/index.ts` | `pnpm lab:check -- --lab 04 --start --verbose` |
| `05` | `issuer/src/index.ts`, `verifier/src/index.ts` | `pnpm lab:check -- --lab 05 --start --verbose` |

## Which cheat sheet to share

- [lab-00-start.md](lab-00-start.md)
- [lab-01-sd-jwt.md](lab-01-sd-jwt.md)
- [lab-02-bbs.md](lab-02-bbs.md)
- [lab-03-ohttp.md](lab-03-ohttp.md)
- [lab-04-iproov.md](lab-04-iproov.md)
- [lab-05-revocation.md](lab-05-revocation.md)

## Recommended classroom use

1. Teach the lab live first.
2. Keep students on their own solution attempt during the exercise.
3. If someone is blocked hard, use the fast-forward helper on their repo.
4. After the lesson, post the matching cheat sheet as the working answer.
5. Remind students that the answer files come from the integrated repo, so later-lab code may already be present around the exact lesson logic.
