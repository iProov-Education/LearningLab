# Learning Lab — World-Class Implementation Kit

This kit is the opinionated path I would use to turn your current lab into a low-click, high-automation course operation.

## Recommended operating model

Use a **three-repo model**:

1. **Instructor repo**  
   Your current monorepo, where you author the finished lab, docs, grading logic, and release process.

2. **Student starter repo**  
   A clean template repo generated from the instructor repo, with solution files replaced by TODO scaffolds.

3. **Course-ops repo**  
   A small automation repo that:
   - provisions GitHub repos from the starter template
   - posts assignments to Google Classroom
   - syncs grades back from GitHub Actions to Google Classroom

That gives you a clean separation between **curriculum**, **student starter code**, and **operations**.

## What is inside

- `docs/` — the implementation plan, architecture, runbook, and launch checklist
- `catalog/` — example course config, GitHub identity CSV, and lab assignment specs
- `course-ops/` — working Node-based scaffolding for GitHub + Google Classroom automation
- `overlays/instructor-repo/` — scripts and code overlays to split instructor vs student repos cleanly

## Recommended sequence

1. Read `docs/02-step-by-step-implementation-plan.md`
2. Generate a starter repo with `overlays/instructor-repo/scripts/build-student-template.mjs`
3. Create a real GitHub template repo from that generated output
4. Configure `course-ops/.env` and copy `catalog/course.config.example.yaml` to your real config
5. Run:
   - `node src/cli.mjs import-google-roster ...`
   - `node src/cli.mjs join-identities ...`
   - `node src/cli.mjs validate ...`
   - `node src/cli.mjs plan ...`
   - `node src/cli.mjs provision-github ... --apply`
   - `node src/cli.mjs progress ...`
   - `node src/cli.mjs advance-ready ... --apply`
   - `node src/cli.mjs reconcile ...`
   - `node src/cli.mjs publish-google ... --apply`
   - `node src/cli.mjs sync-grades ... --apply`

## Design principles

- **Automation-first**: repo creation, LMS posting, and grade sync should be scriptable
- **Dry-run by default**: destructive actions require `--apply`
- **Auditable**: all commands write JSON/Markdown artifacts
- **No hidden control plane**: YAML catalog + `.env` + generated reports
- **Student-safe**: starter repo contains no instructor-only ops tooling or solved lab files

## A good first milestone

You do **not** need to build add-ons or deep LTI-style embedding first. A world-class v1 is:

- GitHub template repo for student code
- GitHub Actions for grading
- Google Classroom API for assignment publishing and grade passback
- strong runbooks, dry-runs, and reports

That gets you 90% of the operational value with a fraction of the integration cost.
