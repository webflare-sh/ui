import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { preset } from '../../preset/src/index.ts'
import { flattenPreset, normalizeValue, type FlatTokens } from '../../../scripts/tokens.ts'

const fixture = <T>(name: string) => JSON.parse(readFileSync(new URL(`./fixtures/tokens/${name}`, import.meta.url), 'utf8')) as T

const imported = fixture<{ tokens: FlatTokens }>('imported-tokens.json').tokens
const inventory = fixture<{ tokens: { path: string, action: string, publishedAs?: string, resolved: { light: string, dark: string } }[] }>('micropage-inventory.json').tokens
const removed = fixture<{ removed: { path: string }[] }>('removed-colors.json').removed.map(entry => entry.path)

const current = flattenPreset(preset, { light: [], dark: ['_dark'] })
const colorPaths = (tokens: FlatTokens) => Object.keys(tokens).filter(path => path.startsWith('colors.'))
const isStatus = (path: string) => /^colors\.(?:danger|success|warning|info)(?:\.|$)/.test(path)

/** Library roles that stay without a website counterpart. */
const libraryRoles = [
  'colors.neutral.inverse',
  'colors.neutral.subtle',
  'colors.border.hover',
  'colors.border.card',
  'colors.text.muted',
  'colors.text.placeholder',
  'colors.loader.track',
]

const inventoryColors = inventory.filter(token => token.path.startsWith('colors.') && token.action !== 'skip')
const published = new Map(inventoryColors.map(token => [token.publishedAs ?? token.path, token]))

describe('0.5.0 snapshot → current colors', () => {
  it('publishes the inventory colors, the status colors, and the library roles, nothing else', () => {
    const unexpected = colorPaths(current).filter(path => !published.has(path) && !isStatus(path) && !libraryRoles.includes(path))
    expect(unexpected).toEqual([])
  })

  it('publishes every inventory color with its value in each mode', () => {
    for (const [path, token] of published) {
      expect(current[path], path).toBeDefined()
      expect(normalizeValue(current[path]!.light), `${path} (light)`).toBe(normalizeValue(token.resolved.light))
      expect(normalizeValue(current[path]!.dark), `${path} (dark)`).toBe(normalizeValue(token.resolved.dark))
    }
  })

  it('removes exactly the tokens in the removed-color fixture', () => {
    const gone = colorPaths(imported).filter(path => !current[path])
    expect(gone.sort()).toEqual([...removed].sort())
  })

  it('changes the value only of replaced colors and re-pointed roles', () => {
    const changed = colorPaths(imported).filter((path) => {
      const now = current[path]
      if (!now) return false
      const before = imported[path]!
      return normalizeValue(now.light) !== normalizeValue(before.light) || normalizeValue(now.dark) !== normalizeValue(before.dark)
    })
    expect(changed.sort()).toEqual([
      'colors.border.subtle',
      'colors.brand.100',
      'colors.brand.200',
      'colors.brand.300',
      'colors.brand.400',
      'colors.brand.50',
      'colors.brand.600',
      'colors.neutral.light',
      'colors.primary',
      'colors.surface.raised',
      'colors.text.muted',
      'colors.transparent',
    ])
  })

  it('keeps the status colors with the same value in each mode', () => {
    const status = colorPaths(imported).filter(isStatus)
    expect(status.length).toBe(16)
    for (const path of status) {
      expect(current[path], path).toEqual({ ...imported[path], kind: current[path]!.kind })
    }
  })

  it('has exactly two raw hex colors with alpha: accent-subtle and accent-border in dark mode', () => {
    const withAlpha = Object.entries(current)
      .filter(([path]) => path.startsWith('colors.'))
      .flatMap(([path, token]) => (['light', 'dark'] as const).filter(mode => /^#[\da-f]{8}$/i.test(token[mode]) && path !== 'colors.transparent').map(mode => `${path} (${mode})`))
    expect(withAlpha.sort()).toEqual(['colors.accent-border (dark)', 'colors.accent-subtle (dark)'])
  })

  it('has no raw rgba() colors left in the component styles', () => {
    const dir = new URL('../../components/src', import.meta.url).pathname
    const files = (function walk(path: string): string[] {
      return statSync(path).isDirectory() ? readdirSync(path).flatMap(name => walk(join(path, name))) : [path]
    })(dir).filter(file => /\.(?:ts|vue)$/.test(file) && !file.includes('/src/vue/'))
    const hits = files.filter(file => /rgba?\(/.test(readFileSync(file, 'utf8')))
    expect(hits).toEqual([])
  })
})
