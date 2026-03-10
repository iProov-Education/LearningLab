# Recommended operating model

## The core decision

Treat **GitHub as the execution system** and **Google Classroom as the LMS / roster / gradebook**.

That means:

- repos live in GitHub
- starter code and grading live in GitHub
- course posts, due dates, and visible grades live in Google Classroom
- one small `course-ops` repo stitches the two together

## Why this beats UI-heavy GitHub Classroom for your case

GitHub Classroom is great for quick starts, but the operational surface is still centered around the web UI. Your lab already has enough sophistication that you will get more leverage from:

- template repos
- repo provisioning via API
- a typed assignment catalog
- repeatable grade sync

That gives you **course-as-code** rather than **course-as-clicks**.

## The three repositories

### 1) Instructor repo

Purpose:
- author the real lab
- maintain the final reference implementation
- maintain grading logic and release notes
- generate the student starter repo

Recommended contents:
- full lab implementation
- instructor docs
- grading workflows
- template-generation script
- release notes
- internal ops docs

### 2) Student starter repo

Purpose:
- clean starter code for students
- public or org-owned template repo
- no solved lab files
- no instructor-only scripts

Recommended contents:
- scaffolded issuer/verifier files with TODO markers
- lab handouts
- bootstrap scripts
- autograding workflow
- Codespaces / devcontainer config
- local checker

### 3) Course-ops repo

Purpose:
- provision student repos from the starter template
- add students as collaborators
- set `LAB_ID` or equivalent repo variables
- report repo progress and advance only ready students
- reconcile roster, repo-map, and live GitHub state
- publish Google Classroom coursework
- sync grades from GitHub Actions back to Classroom

Recommended contents:
- course config YAML
- assignment specs
- roster import
- GitHub API scripts
- Google Classroom API scripts
- workflows for release + grade sync
- generated artifacts

## Suggested lifecycle

### Before the term

- stabilize the instructor repo
- generate and test the starter repo
- mark the starter repo as a template
- configure Google OAuth and GitHub credentials
- dry-run the `course-ops` commands with a fake roster

### During the term

- create or update assignment specs in `catalog/assignments`
- provision repos for the cohort
- publish assignment posts to Google Classroom
- let GitHub Actions autograde continuously
- sync draft grades nightly
- publish assigned grades when you want them student-visible

### After the term

- archive generated reports
- archive or transfer student repos if needed
- keep the instructor repo as the authoritative source for next term
- rotate secrets / tokens

## Naming conventions

Keep naming boring and predictable.

### GitHub repositories

Pattern:
`<course-slug>-<assignment-slug>-<github-username>`

Example:
`learninglab-lab-01-issuance-octocat`

### Google Classroom coursework

Pattern:
`Lab 01 — SD-JWT Issuance`

### Local artifacts

Pattern:
- `artifacts/plan.lab-01.md`
- `artifacts/repo-map.lab-01.json`
- `artifacts/coursework.lab-01.json`
- `artifacts/grade-sync.lab-01.json`

## Security stance

Minimum viable:
- fine-grained GitHub token for repo provisioning
- Google OAuth client + refresh token for the teacher account

Preferred at scale:
- GitHub App for provisioning
- dedicated Google Cloud project for Classroom operations
- locked-down course-ops secrets in a private repo

## Definition of world-class

A world-class setup is not “the fanciest integration.” It is:

- reliable
- scriptable
- understandable by the next instructor
- safe to dry-run
- easy to audit
- resilient when a student or TA needs help at 11pm
