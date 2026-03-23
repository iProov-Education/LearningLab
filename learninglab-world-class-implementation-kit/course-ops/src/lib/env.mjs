import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'

let loaded = false

export function loadCourseOpsEnv() {
  if (loaded) return
  loaded = true

  for (const envPath of resolveEnvPaths()) {
    if (!fs.existsSync(envPath)) continue
    dotenv.config({ path: envPath, override: false })
  }
}

export function resolveEnvPaths({
  envFile = process.env.COURSE_OPS_ENV_FILE,
  envDir = process.env.COURSE_OPS_ENV_DIR
} = {}) {
  if (envFile) {
    return [path.resolve(envFile)]
  }

  const baseDir = envDir
    ? path.resolve(envDir)
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

  return [
    path.join(baseDir, '.env.local'),
    path.join(baseDir, '.env')
  ]
}

loadCourseOpsEnv()
