# Step-by-step implementation plan

This is written as a practical rollout plan, not a theory document.

## Phase 0 — Decide the control plane

### Goal
Choose the system of record and remove ambiguity.

### Do this
1. Make the **instructor repo** the source of truth for curriculum.
2. Make the **student starter repo** the source of truth for what students begin from.
3. Make the **course-ops repo** the source of truth for provisioning, publishing, and grading.
4. Decide that GitHub Classroom is optional / fallback, not the primary control plane.

### Exit criteria
- one architecture decision memo exists
- the three-repo model is accepted
- a course owner and an operations owner are named

---

## Phase 1 — Split instructor and student repos cleanly

### Goal
Stop shipping solved code to students.

### Do this
1. Keep your existing monorepo as the instructor repo.
2. Generate a separate starter repo using:
   `overlays/instructor-repo/scripts/build-student-template.mjs`
3. Replace solved runtime files with TODO scaffolds:
   - `issuer/src/index.ts`
   - `verifier/src/index.ts`
4. Remove instructor-only scripts from the starter repo:
   - `scripts/classroom-progress.js`
   - `scripts/classroom-advance.js`
   - `scripts/set-lab-id.js`
5. Keep only student-safe workflows and checks.

### Hardening tasks
- move generated template output to `dist/student-template`
- do not generate into a hand-edited source directory
- add a generated marker file into the template output
- smoke-test the generated starter repo separately

### Exit criteria
- a starter repo can be generated repeatably
- the starter repo runs Lab 00 and fails Labs 01–05 until students implement them
- no instructor-only docs or scripts leak into the starter repo

---

## Phase 2 — Fix correctness issues in the lab itself

### Goal
Remove operational bugs before you scale.

### Do this
1. Fix status-list allocation so a clear revocation bit is **not** treated as “unused.”
2. Persist allocation state separately from the revocation bitstring.
3. Keep credential allocation monotonic unless you explicitly design index reuse.
4. Add a small unit test for allocation and revocation semantics.

### Included scaffold
See:
- `overlays/instructor-repo/status-store/README.md`
- `overlays/instructor-repo/status-store/status-store.ts`

### Exit criteria
- two active credentials never share a status-list index
- revoking one credential never revokes another accidentally

---

## Phase 3 — Build the starter template repo

### Goal
Create the repo students actually start from.

### Do this
1. Create a new repo in your GitHub org, for example:
   `learninglab-starter`
2. Push the generated output from `dist/student-template` there.
3. Mark that repo as a GitHub template.
4. Test “create repo from template” manually once.
5. Confirm:
   - devcontainer works
   - autograding workflow runs
   - lab docs are present
   - no solution files are present

### Exit criteria
- starter repo is template-enabled
- a fresh repo from the template boots cleanly
- starter repo is safe to expose to students

---

## Phase 4 — Stand up Google and GitHub credentials

### Goal
Prepare the automation control plane.

### GitHub
1. Create a fine-grained token or GitHub App for the automation.
2. Ensure it can:
   - create repos from the template
   - set repository variables
   - add collaborators
   - read workflow runs

### Google Classroom
1. Create a Google Cloud project.
2. Enable the Classroom API.
3. Create an OAuth client.
4. Capture a refresh token for the teacher account used to post and grade.
5. Store secrets in the private `course-ops` repo.

### Minimum scopes
- Classroom coursework for teachers
- roster read
- profile emails
- courses read

### Exit criteria
- both APIs authenticate successfully from local CLI
- a test API call works in dry-run mode

---

## Phase 5 — Configure the course catalog

### Goal
Make assignments data-driven.

### Do this
1. Copy `catalog/course.config.example.yaml` to your real course config.
2. Create or edit assignment YAML for each lab.
3. Import the enrolled roster from Google Classroom with `import-google-roster`.
4. Maintain a separate GitHub identity CSV with:
   - student email
   - GitHub username
   - optional Google user ID
5. Join those two sources with `join-identities` to produce the provisioning roster CSV.
6. Decide grade policy:
   - success score
   - failure score
   - in-progress score
   - whether to publish assigned grades immediately or keep draft only first

### Exit criteria
- the Google roster artifact imports successfully
- the identity join report contains zero blocking issues
- `node src/cli.mjs validate ...` passes
- `node src/cli.mjs plan ...` produces a readable plan artifact

---

## Phase 6 — Provision repos

### Goal
Create all student repos without UI work.

### Do this
1. Run `plan` first.
2. Run `provision-github` in dry-run mode.
3. Review the generated repo names and collaborator mappings.
4. Run `provision-github --apply`.
5. Archive the generated repo map artifact.

### Good practice
- provision a dummy cohort first
- keep naming deterministic
- use private repos by default

### Exit criteria
- every student has a repo
- every repo has the correct `LAB_ID`
- every repo has the correct collaborator
- the repo map is archived

---

## Phase 7 — Publish to Google Classroom

### Goal
Create the assignment post programmatically.

### Do this
1. Render the coursework description from the assignment catalog.
2. Include materials that are safe to share with the whole class:
   - lab handout
   - starter repo landing page
   - common setup guide
3. Publish first as `DRAFT`.
4. Review the post in Classroom.
5. Switch to `PUBLISHED` when satisfied.

### Important
Do **not** post a class-wide artifact containing every student’s personal repo link.

### Exit criteria
- coursework exists in Classroom
- the title, description, due date, and points are correct
- the returned `courseWorkId` is captured as an artifact

---

## Phase 8 — Pilot the full loop

### Goal
Prove the system end-to-end before the real cohort.

### Use at least three test identities
- instructor account
- TA or second teacher account
- student account

### Test scenarios
1. Repo provision
2. Student collaborator access
3. Local dev bootstrap
4. GitHub Actions autograding
5. `progress` identifies ready repos correctly
6. `advance-ready` updates only the intended students
7. `reconcile` catches missing repos, wrong `LAB_ID`, and missing collaborators
8. Grade sync into Classroom
9. Draft vs assigned grade behavior
10. Student visibility in Classroom
11. Re-run / idempotency
12. Missing GitHub username
13. Failed workflow run
14. Renamed repo or changed workflow file

### Exit criteria
- no manual UI steps are required for the happy path
- errors produce clear reports
- idempotent reruns do not duplicate work

---

## Phase 9 — Launch the real cohort

### Goal
Ship with guardrails.

### Do this
1. Freeze the starter template for the current cohort.
2. Tag the instructor repo.
3. Run repo provisioning.
4. Publish coursework.
5. Announce student startup instructions.
6. Enable nightly draft-grade sync.
7. Keep assigned grades manual until the first week feels stable.

### Exit criteria
- the first cohort is live
- there is a single runbook for instructors and TAs
- rollback steps are documented

---

## Phase 10 — Operate and improve

### Goal
Make it boring.

### Add next
- dashboards on workflow pass/fail rates
- weekly health reports
- assignment release checklists
- automated reminder posts
- GitHub App migration
- add-on or richer Google integration only if it buys real value

## Recommended implementation order

If you want the shortest path to something excellent:

1. Split instructor vs starter repo
2. Fix status-list allocation
3. Create starter template repo
4. Stand up `course-ops`
5. Automate repo provisioning
6. Automate Google coursework publish
7. Automate draft-grade sync
8. Keep final grade publication manual until the system proves itself
