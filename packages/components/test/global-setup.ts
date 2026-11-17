import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { writeVueEntryModules } from '../write-vue-entry-modules.ts'

/**
 * Runs once in the main Vitest process, before any worker starts. Codegen used
 * to run from `setupFiles`, where every worker raced `panda codegen --clean`
 * on the same folder.
 */
export default function setup() {
  const packageRoot = resolve(import.meta.dirname, '..')
  if (!existsSync(resolve(packageRoot, 'styled-system/css/index.js'))) {
    execFileSync('bun', ['run', 'codegen'], { cwd: packageRoot, stdio: 'inherit' })
  }
  // `src/resolver.ts` imports the generated component names.
  writeVueEntryModules()
}
