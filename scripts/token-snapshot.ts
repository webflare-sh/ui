/**
 * Write a JSON snapshot of the preset tokens at a git ref.
 *
 *   bun scripts/token-snapshot.ts <ref> <outfile> [--light=_light] [--dark=_dark]
 *
 * `--light` / `--dark` list the semantic-token condition keys that hold each
 * mode's value (comma-separated, in lookup order). `base` is always the
 * fallback, so the mode without keys is the default mode.
 *
 * Only token names and values are written. The package name, the preset name,
 * and token descriptions are left out.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flattenPreset, type ColorMode, type ModeConditions } from './tokens'

const rootDir = fileURLToPath(new URL('..', import.meta.url))

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: rootDir, encoding: 'utf8' }).trim()
}

function parseConditions(args: string[]): ModeConditions {
  const conditions: ModeConditions = { light: [], dark: [] }
  for (const arg of args) {
    const match = /^--(light|dark)=(.*)$/.exec(arg)
    if (!match) {
      throw new Error(`Unknown argument: ${arg}`)
    }
    conditions[match[1] as ColorMode] = match[2]!.split(',').filter(Boolean)
  }
  return conditions
}

const [ref, outfile, ...rest] = process.argv.slice(2)
if (!ref || !outfile) {
  console.error('Usage: bun scripts/token-snapshot.ts <ref> <outfile> [--light=_light] [--dark=_dark]')
  process.exit(1)
}

const conditions = parseConditions(rest)
const commit = git('rev-parse', '--short', ref)
const version = (JSON.parse(git('show', `${commit}:package.json`)) as { version: string }).version

// Extract inside the repo so the preset resolves @pandacss/* from node_modules.
const workDir = join(rootDir, 'node_modules/.cache/token-snapshot', commit)
rmSync(workDir, { recursive: true, force: true })
mkdirSync(workDir, { recursive: true })
execFileSync('sh', ['-c', `git archive ${commit} packages/preset/src | tar -x -C "${workDir}"`], { cwd: rootDir })

const { preset } = await import(join(workDir, 'packages/preset/src/index.ts'))
const tokens = flattenPreset(preset, conditions)
rmSync(workDir, { recursive: true, force: true })

const defaultMode: ColorMode = conditions.light.length === 0 ? 'light' : 'dark'
const snapshot = {
  source: { version, commit },
  defaultMode,
  conditions,
  tokens,
}

writeFileSync(resolve(process.cwd(), outfile), `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`${Object.keys(tokens).length} tokens from ${commit} (${version}) → ${outfile}`)
