# Cutover checklist

## 1 week before launch

- [ ] instructor repo tagged
- [ ] starter repo regenerated from the latest instructor repo
- [ ] starter repo smoke-tested locally
- [ ] template repo flag enabled on GitHub
- [ ] course config reviewed
- [ ] roster CSV reviewed
- [ ] Google OAuth credentials tested
- [ ] GitHub automation token tested
- [ ] dry-run plan artifact generated
- [ ] dummy cohort pilot completed

## 1 day before launch

- [ ] starter template frozen for the cohort
- [ ] assignment YAML due dates checked
- [ ] handout links checked
- [ ] autograding workflow passes on a sample student repo
- [ ] repo naming pattern checked
- [ ] grade policy reviewed with teaching staff
- [ ] rollback plan reviewed

## Launch day

- [ ] run repo provisioning in dry-run
- [ ] review repo map
- [ ] run repo provisioning with `--apply`
- [ ] verify a random sample of repos
- [ ] run `progress` and confirm the initial cohort state looks correct
- [ ] create Google Classroom coursework as draft
- [ ] review in Classroom UI
- [ ] publish coursework
- [ ] send student launch message
- [ ] watch first workflow runs

## First 24 hours

- [ ] verify first 5 student repos build correctly
- [ ] run `reconcile` and clear any repo drift before grade sync
- [ ] verify at least 1 passing and 1 failing grade sync
- [ ] keep grade sync on draft grades only
- [ ] log all exceptions in one place
- [ ] do not change the starter template unless absolutely necessary

## Rollback

If something goes wrong:

1. stop publishing new coursework
2. disable automated grade sync
3. keep GitHub grading intact
4. publish a manual announcement with fallback instructions
5. fix the issue in `course-ops`
6. rerun from artifacts

## Incident priorities

### P0
- students cannot access repos
- coursework posted to wrong course
- grades published incorrectly to students

### P1
- grade sync failing but grading still works in GitHub
- individual roster mismatches
- one or more repos missing collaborators

### P2
- reporting artifacts incomplete
- due dates or text need correction
