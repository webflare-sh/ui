/**
 * Color checks. Run with `bun run check:colors`.
 *
 * 1. CSS check (blocking): generate the CSS, then every `var(--colors-*)` must
 *    be declared and no color property may contain a raw token name.
 * 2. strictTokens (blocking for color properties): findings on other
 *    properties are listed, not fixed.
 * 3. Contrast (warning only, never fails): text 4.5:1, borders and focus 3:1,
 *    in both modes.
 */
import { preset } from '../packages/preset/src/index.ts'
import { checkContrast } from './colors/contrast'
import { checkCss, generateCss } from './colors/css-check'
import { runStrictTokens } from './colors/strict-tokens'
import { flattenPreset } from './tokens'

const github = process.env.GITHUB_ACTIONS === 'true'
let failed = false

console.log('CSS check')
const cssIssues = checkCss(generateCss())
for (const issue of cssIssues) {
  console.log(github ? `::error::${issue.detail}` : `  ✗ ${issue.detail}`)
}
console.log(cssIssues.length === 0 ? '  ✓ every var(--colors-*) is defined; no raw token names' : `  ${cssIssues.length} issue(s)`)
failed ||= cssIssues.length > 0

console.log('\nstrictTokens')
const findings = runStrictTokens()
const colorFindings = findings.filter(finding => finding.color)
for (const finding of colorFindings) {
  const text = `${finding.file}:${finding.line} ${finding.property}: ${finding.message}`
  console.log(github ? `::error file=${finding.file},line=${finding.line}::${text}` : `  ✗ ${text}`)
}
const byProperty = new Map<string, number>()
for (const finding of findings.filter(entry => !entry.color)) {
  byProperty.set(finding.property, (byProperty.get(finding.property) ?? 0) + 1)
}
console.log(`  ${colorFindings.length === 0 ? '✓' : '✗'} ${colorFindings.length} finding(s) on color properties`)
console.log(`  ${findings.length - colorFindings.length} finding(s) on other properties (listed, not fixed):`)
for (const [property, count] of [...byProperty].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))) {
  console.log(`    ${property}: ${count}`)
}
failed ||= colorFindings.length > 0

console.log('\nContrast (warning only)')
const tokens = flattenPreset(preset, { light: [], dark: ['_dark'] })
for (const result of checkContrast(tokens)) {
  const text = `${result.mode} ${result.label}: ${result.ratio}:1 (needs ${result.min}:1)`
  if (result.ok) console.log(`  ✓ ${text}`)
  else console.log(github ? `::warning::Contrast ${text}` : `  ! ${text}`)
}

process.exit(failed ? 1 : 0)
