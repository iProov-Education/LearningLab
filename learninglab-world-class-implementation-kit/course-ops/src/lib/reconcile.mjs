import { buildRepoName } from './catalog.mjs'
import { classifyWorkflowRun } from './scoring.mjs'

export function buildReconciliationPlan({ courseConfig, assignment, roster, repoMap }) {
  const repoRows = repoMap?.repos || []
  const rosterByEmail = new Map(
    (roster || []).map((row) => [normalizeKey(row.studentEmail), row])
  )
  const repoMapByEmail = new Map(
    repoRows.map((row) => [normalizeKey(row.studentEmail), row])
  )

  const missingRepoMapEntries = (roster || [])
    .filter((row) => !repoMapByEmail.has(normalizeKey(row.studentEmail)))
    .map((row) => ({
      studentName: row.studentName,
      studentEmail: row.studentEmail,
      githubUsername: row.githubUsername,
      googleUserId: row.googleUserId || null,
      expectedRepoName: buildRepoName(courseConfig, assignment, row)
    }))

  const unexpectedRepoMapEntries = repoRows
    .filter((row) => !rosterByEmail.has(normalizeKey(row.studentEmail)))
    .map((row) => ({
      studentName: row.studentName,
      studentEmail: row.studentEmail,
      githubUsername: row.githubUsername,
      googleUserId: row.googleUserId || null,
      repoFullName: row.repoFullName || `${row.repoOwner}/${row.repoName}`
    }))

  const repoChecks = repoRows.map((row) => {
    const rosterRow = rosterByEmail.get(normalizeKey(row.studentEmail)) || row
    const expectedRepoName = buildRepoName(courseConfig, assignment, rosterRow)

    return {
      ...row,
      expectedRepoName,
      expectedLabId: assignment.labId,
      expectedCollaborator: courseConfig.github.addStudentAsCollaborator ? row.githubUsername : null,
      repoNameMatches: row.repoName === expectedRepoName
    }
  })

  return {
    missingRepoMapEntries,
    unexpectedRepoMapEntries,
    repoChecks
  }
}

export function summarizeRepoReconciliation({
  row,
  repository,
  currentLabId,
  collaboratorPermission,
  latestRun
}) {
  const workflow = classifyWorkflowRun(latestRun)
  const issues = []
  const repoExists = Boolean(repository)

  if (!repoExists) {
    issues.push('Repository does not exist')
  }

  if (!row.repoNameMatches) {
    issues.push(`Expected repo name ${row.expectedRepoName}, found ${row.repoName}`)
  }

  if (!currentLabId) {
    issues.push('LAB_ID is missing')
  } else if (currentLabId !== row.expectedLabId) {
    issues.push(`Expected LAB_ID ${row.expectedLabId}, found ${currentLabId}`)
  }

  const collaboratorRequired = Boolean(row.expectedCollaborator)
  const collaboratorMatches = !collaboratorRequired || Boolean(collaboratorPermission)
  if (collaboratorRequired && !collaboratorPermission) {
    issues.push(`Collaborator ${row.expectedCollaborator} is missing`)
  }

  return {
    studentName: row.studentName,
    studentEmail: row.studentEmail,
    githubUsername: row.githubUsername,
    googleUserId: row.googleUserId || null,
    repoOwner: row.repoOwner,
    repoName: row.repoName,
    repoFullName: row.repoFullName || `${row.repoOwner}/${row.repoName}`,
    repoUrl: row.repoUrl || repository?.html_url || `https://github.com/${row.repoOwner}/${row.repoName}`,
    repoExists,
    expectedRepoName: row.expectedRepoName,
    repoNameMatches: row.repoNameMatches,
    expectedLabId: row.expectedLabId,
    currentLabId: currentLabId || '',
    labIdMatches: currentLabId === row.expectedLabId,
    expectedCollaborator: row.expectedCollaborator || null,
    collaboratorPermission: collaboratorPermission || null,
    collaboratorMatches,
    workflowState: workflow.state,
    workflowReason: workflow.reason,
    workflowStatus: latestRun?.status || null,
    workflowConclusion: latestRun?.conclusion || null,
    runUrl: latestRun?.html_url || '',
    issues
  }
}

export function summarizeReconciliation({ rosterStudents, missingRepoMapEntries, unexpectedRepoMapEntries, repos }) {
  const counts = {
    rosterStudents,
    repoMapRepos: repos.length,
    missingRepoMapEntries: missingRepoMapEntries.length,
    unexpectedRepoMapEntries: unexpectedRepoMapEntries.length,
    missingRepos: 0,
    repoNameMismatches: 0,
    missingLabIds: 0,
    labIdMismatches: 0,
    collaboratorMismatches: 0
  }

  for (const row of repos || []) {
    if (!row.repoExists) counts.missingRepos += 1
    if (!row.repoNameMatches) counts.repoNameMismatches += 1
    if (!row.currentLabId) counts.missingLabIds += 1
    if (row.currentLabId && !row.labIdMatches) counts.labIdMismatches += 1
    if (!row.collaboratorMatches) counts.collaboratorMismatches += 1
  }

  const ok = counts.missingRepoMapEntries === 0 &&
    counts.unexpectedRepoMapEntries === 0 &&
    counts.missingRepos === 0 &&
    counts.repoNameMismatches === 0 &&
    counts.labIdMismatches === 0 &&
    counts.collaboratorMismatches === 0

  return { ok, counts }
}

function normalizeKey(value) {
  return String(value || '').trim().toLowerCase()
}
