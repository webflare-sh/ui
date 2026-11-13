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
const current = flattenPreset(preset, { light: ['_light'], dark: [] })

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
