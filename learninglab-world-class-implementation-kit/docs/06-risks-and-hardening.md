# Risks and hardening

## 1) Student starter repo accidentally contains solved code

### Risk
The biggest credibility failure is giving students a “starter repo” that is actually already solved.

### Mitigation
- generate the starter repo from the instructor repo
- replace solved files with explicit TODO scaffolds
- smoke-test Labs 01–05 from the generated output
- review the generated tree before publishing

## 2) Status-list allocation bug

### Risk
A clear revocation bit means “not revoked,” not “never used.” If you allocate by scanning for the first clear bit, multiple active credentials can receive the same index.

### Mitigation
- persist allocation state separately
- keep a monotonic `nextIndex`
- treat revocation and allocation as separate concerns
- see `overlays/instructor-repo/status-store/`

## 3) LMS content created by the wrong Google Cloud project

### Risk
Google Classroom associates course work and its student submissions with the OAuth client / developer project that created them. If you later try to update from a different project, the API calls can fail.

### Mitigation
- use one dedicated Google Cloud project for course operations
- do not mix manual experiments from another OAuth client into production coursework
- keep the same OAuth project for create + patch + grade sync

## 4) Broad, long-lived automation credentials

### Risk
A personal token or refresh token becomes long-lived infrastructure access.

### Mitigation
- isolate the `course-ops` repo
- restrict access to secrets
- prefer a GitHub App over time
- rotate credentials between terms

## 5) Publishing all student repo URLs to the whole class

### Risk
If you attach a class-wide file of personal repo URLs to Google Classroom, you create a privacy problem.

### Mitigation
- add students directly as repo collaborators
- keep the Google Classroom post generic
- do not publish class-wide personal repo maps

## 6) Grading surprises

### Risk
Automatically publishing grades that students can see on day one can create avoidable confusion.

### Mitigation
- sync `draftGrade` first
- publish `assignedGrade` only after TA/instructor review
- archive every grade-sync report

## 7) Configuration drift

### Risk
The starter repo, assignment text, grade policy, and course post can drift apart.

### Mitigation
- source assignment text from the assignment catalog
- version the starter repo
- keep generated artifacts
- run `reconcile` before grade sync and after any emergency repo intervention
- tag releases per cohort

## 8) Overbuilding too early

### Risk
It is tempting to jump directly to deep add-on integration, custom portals, dashboards, and per-student link generation.

### Mitigation
Build the reliable core first:
- repo provisioning
- coursework publish
- autograding
- draft-grade sync
- runbooks
