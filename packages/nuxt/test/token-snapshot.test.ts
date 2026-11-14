import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { preset } from '../../preset/src/index.ts'
import { flattenPreset, normalizeValue, type FlatTokens } from '../../../scripts/tokens.ts'

interface Snapshot {
  source: { version: string, commit: string }
  defaultMode: 'light' | 'dark'
  tokens: FlatTokens
}

const snapshotFile = new URL('./fixtures/tokens/imported-tokens.json', import.meta.url)
const snapshotText = readFileSync(snapshotFile, 'utf8')
const snapshot = JSON.parse(snapshotText) as Snapshot

// Mode conditions of the current preset. Update together with the color-mode mechanism.
const current = flattenPreset(preset, { light: [], dark: ['_dark'] })

describe('imported token snapshot', () => {
  it('is the 0.5.0 preset of the imported history', () => {
    expect(snapshot.source).toEqual({ version: '0.5.0', commit: 'a895222' })
    expect(Object.keys(snapshot.tokens).length).toBeGreaterThan(100)
  })

  it('holds names and values only', () => {
    expect(snapshotText).not.toMatch(/description/i)
    expect(snapshotText).not.toMatch(new RegExp(['f', 'y', 'r', 's', 't'].join(''), 'i'))
  })

  it('keeps every non-color token with the same value in each mode', () => {
    const nonColor = Object.entries(snapshot.tokens).filter(([path]) => !path.startsWith('colors.'))
    expect(nonColor.length).toBeGreaterThan(50)

    for (const [path, token] of nonColor) {
      const now = current[path]
      expect(now, path).toBeDefined()
      expect(normalizeValue(now!.light), `${path} (light)`).toBe(normalizeValue(token.light))
      expect(normalizeValue(now!.dark), `${path} (dark)`).toBe(normalizeValue(token.dark))
    }
  })
})

describe('non-color tokens added from the design inventory', () => {
  const inventory = (JSON.parse(readFileSync(new URL('./fixtures/tokens/micropage-inventory.json', import.meta.url), 'utf8')) as {
    tokens: { path: string, action: string, resolved: { light: string, dark: string } }[]
  }).tokens
  const additions = new Map(inventory.filter(token => token.action === 'add' && !token.path.startsWith('colors.')).map(token => [token.path, token]))

  it('adds only the tokens the inventory marks as additions, with their values', () => {
    const added = Object.keys(current).filter(path => !path.startsWith('colors.') && !snapshot.tokens[path])
    expect(added.sort()).toEqual([...additions.keys()].sort())
    for (const path of added) {
      const token = additions.get(path)!
      expect(normalizeValue(current[path]!.light), `${path} (light)`).toBe(normalizeValue(token.resolved.light))
      expect(normalizeValue(current[path]!.dark), `${path} (dark)`).toBe(normalizeValue(token.resolved.dark))
    }
  })

  it('writes the mode-dependent shadows for .dark and OS dark', () => {
    const viaOs = flattenPreset(preset, { light: [], dark: ['_osDark'] })
    for (const path of ['shadows.card', 'shadows.float']) {
      expect(current[path]!.light, path).not.toBe(current[path]!.dark)
      expect(viaOs[path], path).toEqual(current[path])
    }
  })

  it('keeps sizes.container apart from the container pattern and the containers scale', () => {
    expect(current['sizes.container']?.light).toBe('1200px')
    expect(preset.patterns?.extend).toHaveProperty('container')
    expect(Object.keys(current).filter(path => path.startsWith('containers.'))).toHaveLength(12)
  })

  it('does not add the website z-index, text styles, keyframes, or recipes', () => {
    expect(Object.keys(current).some(path => path.startsWith('zIndex.'))).toBe(false)
    expect(preset.theme?.textStyles).toBeUndefined()
    expect(preset.theme?.recipes).toBeUndefined()
    expect(preset.theme?.slotRecipes).toBeUndefined()
    for (const name of ['rise', 'float', 'blink']) {
      expect(preset.theme?.extend?.keyframes, name).not.toHaveProperty(name)
    }
  })
})
