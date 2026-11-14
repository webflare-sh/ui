/**
 * `strictTokens` run. The option only changes the generated TypeScript types,
 * so the components are type-checked against a strict codegen in a separate
 * folder (`packages/components/panda.strict-tokens.config.ts`). Every type
 * error there is a finding. Findings on color properties fail the check;
 * the rest are listed.
 */
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { rootDir } from './css-check'

export interface StrictTokensFinding {
  file: string
  line: number
  property: string
  message: string
  color: boolean
}

const COLOR_KEY = /(?:^|[a-z])(?:color|Color)$|^(?:bg|background|fill|stroke|shadowColor|accentColor|caretColor)$/

function run(command: string, args: string[], cwd: string) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8' })
  if (result.error) throw result.error
  return result
}

export function runStrictTokens(): StrictTokensFinding[] {
  const componentsDir = join(rootDir, 'packages/components')
  const codegen = run('npx', ['panda', 'codegen', '--config', 'panda.strict-tokens.config.ts', '--clean', '--log-level', 'error'], componentsDir)
  if (codegen.status !== 0) throw new Error(`strictTokens codegen failed:\n${codegen.stderr}`)
  run('bun', ['write-vue-entry-modules.ts'], componentsDir)
  const tsc = run('npx', ['vue-tsc', '-p', 'tsconfig.strict-tokens.json', '--noEmit'], componentsDir)

  const findings: StrictTokensFinding[] = []
  const sources = new Map<string, string[]>()
  for (const line of `${tsc.stdout}\n${tsc.stderr}`.split('\n')) {
    const match = /^(.+?)\((\d+),(\d+)\): error TS\d+: (.*)$/.exec(line.trim())
    if (!match) continue
    const [, file, lineNo, column, message] = match
    if (!sources.has(file!)) sources.set(file!, readFileSync(join(componentsDir, file!), 'utf8').split('\n'))
    const source = sources.get(file!)![Number(lineNo) - 1] ?? ''
    const key = /^\s*['"]?([\w-]+)['"]?\s*:/.exec(source.slice(Math.max(0, Number(column) - 1))) ?? /^\s*['"]?([\w-]+)['"]?\s*:/.exec(source)
    const property = key?.[1] ?? '?'
    findings.push({
      file: `packages/components/${file}`,
      line: Number(lineNo),
      property,
      message: message!,
      color: COLOR_KEY.test(property) || /\bColorsValue\b/.test(message!),
    })
  }
  if (tsc.status !== 0 && findings.length === 0) {
    throw new Error(`vue-tsc failed without findings:\n${tsc.stdout}\n${tsc.stderr}`)
  }
  return findings
}
