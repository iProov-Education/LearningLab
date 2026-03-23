import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

import { resolveEnvPaths } from '../src/lib/env.mjs'

test('resolveEnvPaths prefers an explicit env file override', () => {
  const envFile = './tmp/instructor-course-ops.env'

  assert.deepEqual(resolveEnvPaths({ envFile }), [
    path.resolve(envFile)
  ])
})

test('resolveEnvPaths loads .env.local before .env from an explicit directory', () => {
  const envDir = '/tmp/course-ops-env'

  assert.deepEqual(resolveEnvPaths({ envDir }), [
    path.join(envDir, '.env.local'),
    path.join(envDir, '.env')
  ])
})
