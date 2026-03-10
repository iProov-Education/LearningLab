import test from 'node:test'
import assert from 'node:assert/strict'
import { buildReconciliationPlan, summarizeRepoReconciliation, summarizeReconciliation } from '../src/lib/reconcile.mjs'

const courseConfig = {
  github: {
    addStudentAsCollaborator: true
  },
  naming: {
    studentRepoPattern: '{{course.slug}}-{{assignment.slug}}-{{github_username}}'
  },
  course: {
    slug: 'learninglab'
  }
}

const assignment = {
  id: 'lab-01',
  labId: '01',
  slug: 'lab-01-issuance',
  github: {}
}

test('buildReconciliationPlan reports missing and unexpected repo-map entries', () => {
  const plan = buildReconciliationPlan({
    courseConfig,
    assignment,
    roster: [
      {
        studentName: 'Ada Lovelace',
        studentEmail: 'ada@example.edu',
        githubUsername: 'adalovelace',
        googleUserId: '1001'
      }
    ],
    repoMap: {
      repos: [
        {
          studentName: 'Grace Hopper',
          studentEmail: 'grace@example.edu',
          githubUsername: 'ghopper',
          googleUserId: '1002',
          repoOwner: 'acme',
          repoName: 'learninglab-lab-01-issuance-ghopper'
        }
      ]
    }
  })

  assert.equal(plan.missingRepoMapEntries.length, 1)
  assert.equal(plan.unexpectedRepoMapEntries.length, 1)
  assert.equal(plan.repoChecks[0].repoNameMatches, true)
})

test('summarizeRepoReconciliation records repo and LAB_ID drift', () => {
  const summary = summarizeRepoReconciliation({
    row: {
      studentName: 'Ada Lovelace',
      studentEmail: 'ada@example.edu',
      githubUsername: 'adalovelace',
      googleUserId: '1001',
      repoOwner: 'acme',
      repoName: 'wrong-name',
      expectedRepoName: 'learninglab-lab-01-issuance-adalovelace',
      expectedLabId: '01',
      expectedCollaborator: 'adalovelace',
      repoNameMatches: false
    },
    repository: { html_url: 'https://github.com/acme/wrong-name' },
    currentLabId: '02',
    collaboratorPermission: null,
    latestRun: {
      status: 'completed',
      conclusion: 'failure',
      html_url: 'https://example.test/run/123'
    }
  })

  assert.equal(summary.repoExists, true)
  assert.equal(summary.labIdMatches, false)
  assert.equal(summary.collaboratorMatches, false)
  assert.equal(summary.workflowState, 'failure')
  assert.equal(summary.issues.length, 3)
})

test('summarizeReconciliation marks the report not ok when drift exists', () => {
  const summary = summarizeReconciliation({
    rosterStudents: 2,
    missingRepoMapEntries: [{ studentEmail: 'ada@example.edu' }],
    unexpectedRepoMapEntries: [],
    repos: [
      {
        repoExists: false,
        repoNameMatches: true,
        currentLabId: '',
        labIdMatches: false,
        collaboratorMatches: true
      }
    ]
  })

  assert.equal(summary.ok, false)
  assert.deepEqual(summary.counts, {
    rosterStudents: 2,
    repoMapRepos: 1,
    missingRepoMapEntries: 1,
    unexpectedRepoMapEntries: 0,
    missingRepos: 1,
    repoNameMismatches: 0,
    missingLabIds: 1,
    labIdMismatches: 0,
    collaboratorMismatches: 0
  })
})
