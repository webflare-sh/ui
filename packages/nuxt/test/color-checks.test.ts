import { describe, expect, it } from 'vitest'
import { preset } from '../../preset/src/index.ts'
import type { ContrastResult } from '../../../scripts/colors/contrast.ts'
import { checkContrast, contrastPairs, contrastRatio, parseColor } from '../../../scripts/colors/contrast.ts'
import { checkCss, generateCss } from '../../../scripts/colors/css-check.ts'
import { flattenPreset } from '../../../scripts/tokens.ts'

describe('CSS color check', () => {
  it('passes on the generated CSS', () => {
    const css = generateCss()
    expect(css).toContain('--colors-primary:')
    expect(checkCss(css)).toEqual([])
  })

  it('fails when a token that a component uses is deleted', () => {
    const css = generateCss({ drop: 'semanticTokens.colors.border.subtle', name: 'drop-border-subtle' })
    const issues = checkCss(css)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.every(issue => issue.kind === 'raw-token-name')).toBe(true)
    expect(issues.map(issue => issue.detail).join('\n')).toContain('border.subtle')
  })

  it('fails when a token that another token references is deleted', () => {
    const css = generateCss({ drop: 'semanticTokens.colors.muted', name: 'drop-muted' })
    // Panda writes the unresolved reference into the dependent variable.
    expect(checkCss(css)).toContainEqual({ kind: 'raw-token-name', detail: '--colors-text-muted: colors.muted (raw token name "colors.muted")' })
  })

  it('finds raw token names and undefined variables in color properties', () => {
    const issues = checkCss(`
      :root { --colors-surface: #fff; }
      .a { color: grey.night; }
      .b { border-color: brand\\.pale; }
      .c { background: var(--colors-lucid-100); }
      .d { opacity: 0.5; line-height: 1.5; color: var(--colors-surface); }
    `)
    expect(issues).toEqual([
      { kind: 'undefined-var', detail: 'var(--colors-lucid-100) is used but never declared' },
      { kind: 'raw-token-name', detail: 'color: grey.night (raw token name "grey.night")' },
      { kind: 'raw-token-name', detail: 'border-color: brand\\.pale (raw token name "brand.pale")' },
    ])
  })
})

describe('contrast check', () => {
  const tokens = flattenPreset(preset, { light: [], dark: ['_dark'] })
  const results = checkContrast(tokens)
  const measured = results.filter(result => 'ratio' in result)
  const ratio = (mode: 'light' | 'dark', label: string) => measured.find(result => result.mode === mode && result.label === label)!.ratio
  const errors = (list: ContrastResult[]) => list.flatMap(result => 'error' in result ? [`${result.mode} ${result.label}: ${result.error}`] : [])

  it('computes WCAG ratios and composites translucent colors', () => {
    expect(contrastRatio(parseColor('#FFFFFF'), parseColor('#000000'))).toBe(21)
    expect(parseColor('#f8796040').a).toBeCloseTo(0.25, 2)
    expect(parseColor('color-mix(in srgb, #000000 30%, transparent)')).toMatchObject({ r: 0, g: 0, b: 0, a: 0.3 })
  })

  it('measures every pair in both modes without throwing', () => {
    expect(results).toHaveLength(contrastPairs.length * 2)
    expect(results.filter(result => result.mode === 'light')).toHaveLength(results.length / 2)
    // A pair that names a token the preset no longer has fails here, not only as a CI warning.
    expect(errors(results)).toEqual([])
  })

  it('reports a pair with an unknown token instead of throwing', () => {
    const stale = { label: 'stale', fg: 'colors.gone', bg: 'colors.surface', min: 4.5 }
    const mixed = { label: 'stale mix', fg: 'color-mix(in srgb, {colors.gone} 30%, transparent)', bg: 'colors.surface', min: 3 }
    const list = checkContrast(tokens, [contrastPairs[0]!, stale, mixed])
    expect(list).toHaveLength(6)
    expect(errors(list)).toEqual([
      'light stale: Unknown token colors.gone',
      'light stale mix: Unknown token colors.gone',
      'dark stale: Unknown token colors.gone',
      'dark stale mix: Unknown token colors.gone',
    ])
    expect(list.filter(result => result.label === contrastPairs[0]!.label && 'ratio' in result)).toHaveLength(2)
  })

  it('reports a missing page background and an unparseable color instead of throwing', () => {
    const { 'colors.surface': _surface, ...withoutSurface } = tokens
    const noPage = checkContrast(withoutSurface, contrastPairs.slice(0, 2))
    expect(errors(noPage)).toHaveLength(4)
    expect(errors(noPage).every(error => error.endsWith('Unknown token colors.surface'))).toBe(true)

    const odd = checkContrast({ ...tokens, 'colors.odd': { kind: 'semantic', light: 'oklch(0.7 0.1 30)', dark: 'oklch(0.3 0.1 30)' } }, [
      { label: 'odd', fg: 'colors.odd', bg: 'colors.surface', min: 4.5 },
    ])
    expect(errors(odd)).toEqual([
      'light odd: Cannot parse color: oklch(0.7 0.1 30)',
      'dark odd: Cannot parse color: oklch(0.3 0.1 30)',
    ])
  })

  it('reports the known warnings and does not change colors to silence them', () => {
    expect(ratio('light', 'primary as text')).toBeCloseTo(2.7, 1)
    expect(ratio('light', 'field border')).toBeGreaterThan(1.4)
    expect(ratio('light', 'field border')).toBeLessThan(1.8)
    expect(ratio('dark', 'field border')).toBeGreaterThan(1.4)
    expect(ratio('dark', 'field border')).toBeLessThan(1.8)
    expect(ratio('light', 'focus ring (primary at 30%)')).toBeLessThan(2)
    expect(ratio('light', 'secondary copy')).toBeCloseTo(4.7, 1)
    expect(ratio('light', 'secondary copy')).toBeGreaterThanOrEqual(4.5)
  })
})
