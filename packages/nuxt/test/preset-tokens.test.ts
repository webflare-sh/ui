import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import presetBase from '@pandacss/preset-base'
import { preset } from '../../preset/src/index.ts'
import { colors as baseColors } from '../../preset/src/tokens/colors.ts'
import { fonts } from '../../preset/src/tokens/typography.ts'
import { colors, fonts as semanticFonts, opacity, shadows } from '../../preset/src/tokens/semantic-tokens.ts'
import { flattenPreset } from '../../../scripts/tokens.ts'

const removed = (JSON.parse(readFileSync(new URL('./fixtures/tokens/removed-colors.json', import.meta.url), 'utf8')) as {
  removed: { path: string }[]
}).removed

const viaClass = flattenPreset(preset, { light: [], dark: ['_dark'] })
const viaOs = flattenPreset(preset, { light: [], dark: ['_osDark'] })

/** Every `{ value: … }` leaf of a semantic token tree. */
function leaves(node: unknown, path: string[] = []): [string, unknown][] {
  if (typeof node !== 'object' || node === null) return []
  if ('value' in node) return [[path.join('.'), (node as { value: unknown }).value]]
  return Object.entries(node).flatMap(([key, child]) => leaves(child, [...path, key]))
}

describe('preset tokens', () => {
  it('nests preset-base as a module so designSystem apps do not resolve the package name', () => {
    expect(preset.presets).toEqual([presetBase])
    expect(preset.presets?.includes('@pandacss/preset-base')).toBe(false)
  })

  it('defines Figtree sans plus system serif and mono', () => {
    expect(fonts.sans?.value).toMatch(/^Figtree,/)
    expect(fonts.serif?.value).toMatch(/^ui-serif,/)
    expect(fonts.mono?.value).toMatch(/^ui-monospace,/)
    expect(semanticFonts.body?.value).toBe('{fonts.sans}')
  })

  it('uses light as the base and the same dark value under .dark and OS dark', () => {
    for (const [path, value] of [...leaves(colors, ['colors']), ...leaves(opacity, ['opacity']), ...leaves(shadows, ['shadows'])]) {
      if (typeof value !== 'object' || value === null) continue
      expect(Object.keys(value).sort(), path).toEqual(['_dark', '_osDark', 'base'])
      const { _dark, _osDark } = value as Record<string, string>
      expect(_osDark, path).toBe(_dark)
    }
    for (const path of Object.keys(viaClass)) {
      expect(viaOs[path], path).toEqual(viaClass[path])
    }
  })

  it('has no light condition of its own', () => {
    expect(preset.conditions?.extend).not.toHaveProperty('light')
    expect(JSON.stringify(preset.theme)).not.toMatch(/"_light"/)
  })

  it('points the role names at the website values', () => {
    const roles: Record<string, [string, string]> = {
      'colors.primary': ['#f87960', '#f87960'],
      'colors.primary-pale': ['#FDF1EB', '#FDF1EB'],
      'colors.surface': ['#FFFFFF', '#171717'],
      'colors.surface.raised': ['#FFFFFF', '#1d1d1d'],
      'colors.neutral': ['#262626', '#FFFFFF'],
      'colors.neutral.inverse': ['#FFFFFF', '#262626'],
      'colors.neutral.light': ['#737373', '#737373'],
      'colors.border': ['#d4d4d4', '#404040'],
      'colors.border.hover': ['#a3a3a3', '#737373'],
      'colors.border.subtle': ['#e5e5e5', '#262626'],
      'colors.muted': ['#737373', '#a3a3a3'],
      'colors.text.muted': ['#737373', '#a3a3a3'],
    }
    for (const [path, [light, dark]] of Object.entries(roles)) {
      expect(viaClass[path], path).toMatchObject({ light, dark })
    }
  })

  it('does not publish the flat spellings of nested roles', () => {
    for (const flat of ['surface-raised', 'border-subtle', 'neutral-light']) {
      expect(colors).not.toHaveProperty([flat])
    }
  })

  it('keeps the status colors with their variants', () => {
    for (const name of ['danger', 'success', 'warning', 'info'] as const) {
      expect(colors[name].DEFAULT).toBeTruthy()
      expect(colors[name].subtle.DEFAULT).toBeTruthy()
      expect(colors[name].subtle.light).toBeTruthy()
      expect(colors[name].text).toBeTruthy()
    }
  })

  it('removes the old aliases and shades', () => {
    expect(removed).toHaveLength(15)
    for (const { path } of removed) {
      expect(viaClass[path], path).toBeUndefined()
    }
    expect(Object.keys(baseColors.brand)).toEqual(['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'])
  })
})
