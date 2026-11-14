/**
 * Color check on the generated Panda CSS.
 *
 * The package ships no compiled CSS, so the CSS is generated first with
 * `panda cssgen` from a throwaway config that loads the preset and the
 * component sources. Then:
 *
 * - every `var(--colors-*)` must be declared somewhere in that CSS;
 * - a color property must not contain a raw token name such as `brand.pale`
 *   (Panda writes an unknown token as plain text).
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const rootDir = fileURLToPath(new URL('../..', import.meta.url))

export interface CssIssue {
  kind: 'undefined-var' | 'raw-token-name'
  detail: string
}

export interface GenerateOptions {
  /** Dotted path under the preset `theme` to delete first, e.g. `semanticTokens.colors.border.subtle`. */
  drop?: string
  /** Name of the work folder under `node_modules/.cache/color-checks`. */
  name?: string
}

/** Generate the full CSS of the preset plus every component style. */
export function generateCss(options: GenerateOptions = {}): string {
  const workDir = join(rootDir, 'node_modules/.cache/color-checks', options.name ?? 'default')
  mkdirSync(workDir, { recursive: true })
  const configFile = join(workDir, 'panda.config.ts')
  const outfile = join(workDir, 'styles.css')

  writeFileSync(configFile, `import { defineConfig } from '@pandacss/dev'
import { preset } from ${JSON.stringify(join(rootDir, 'packages/preset/src/index.ts'))}

function without(node: any, path: string[]): any {
  if (path.length === 0) return node
  const [key, ...rest] = path
  if (rest.length === 0) {
    const { [key!]: _removed, ...kept } = node
    return kept
  }
  return { ...node, [key!]: without(node[key!], rest) }
}

const drop = ${JSON.stringify(options.drop ?? '')}

export default defineConfig({
  preflight: true,
  presets: [{ ...preset, theme: drop ? without(preset.theme, drop.split('.')) : preset.theme }],
  include: [${JSON.stringify(join(rootDir, 'packages/components/src/**/*.{js,ts,vue}'))}],
  exclude: [${JSON.stringify(join(rootDir, 'packages/components/src/vue/**'))}],
  outdir: ${JSON.stringify(join(workDir, 'styled-system'))},
})
`)

  execFileSync('npx', ['panda', 'cssgen', '--config', configFile, '--outfile', outfile, '--log-level', 'error'], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return readFileSync(outfile, 'utf8')
}

const COLOR_PROPERTY = /^(?:color|background(?:-color)?|border(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?-color|border(?:-(?:top|right|bottom|left))?|outline(?:-color)?|text-decoration(?:-color)?|caret-color|accent-color|fill|stroke|box-shadow|text-shadow|column-rule-color|--[\w-]*(?:color|bg|shadow)[\w-]*)$/

/** A dotted token path such as `brand.pale` or `grey.night` (not a number like `0.5`). */
const RAW_TOKEN = /(?<![\w.#-])[a-z][\w-]*\.[\w.-]*[a-z\d](?![\w(])/i

/** Every `property: value` declaration in the CSS. */
function declarations(css: string): { property: string, value: string }[] {
  const out: { property: string, value: string }[] = []
  for (const match of css.matchAll(/([-\w]+)\s*:([^;{}]+);/g)) {
    out.push({ property: match[1]!.trim(), value: match[2]!.trim() })
  }
  return out
}

export function checkCss(css: string): CssIssue[] {
  const issues: CssIssue[] = []

  const declared = new Set([...css.matchAll(/(--colors-[\w-]+)\s*:/g)].map(match => match[1]!))
  const used = new Set([...css.matchAll(/var\((--colors-[\w-]+)/g)].map(match => match[1]!))
  for (const name of [...used].sort()) {
    if (!declared.has(name)) {
      issues.push({ kind: 'undefined-var', detail: `var(${name}) is used but never declared` })
    }
  }

  const seen = new Set<string>()
  for (const { property, value } of declarations(css)) {
    if (!COLOR_PROPERTY.test(property)) continue
    // Strip urls, strings, and var() names before looking for dotted names.
    // Panda escapes the dot of an unknown token name (`border\.subtle`).
    const bare = value.replace(/\\/g, '').replace(/url\([^)]*\)|"[^"]*"|'[^']*'|var\(--[\w-]+/g, '')
    const raw = RAW_TOKEN.exec(bare)
    if (raw) {
      const detail = `${property}: ${value} (raw token name "${raw[0]}")`
      if (!seen.has(detail)) {
        seen.add(detail)
        issues.push({ kind: 'raw-token-name', detail })
      }
    }
  }
  return issues
}
