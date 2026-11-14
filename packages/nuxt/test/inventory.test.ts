import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { normalizeValue, type FlatTokens } from '../../../scripts/tokens.ts'

interface InventoryToken {
  path: string
  origin: 'design-file' | 'app-level'
  kind: 'token' | 'semantic'
  value: string | { light: string, dark: string }
  resolved: { light: string, dark: string }
  action: 'add' | 'replace' | 'keep' | 'keep-library' | 'publish-as' | 'skip'
  publishedAs?: string
  note?: string
}

const inventoryText = readFileSync(new URL('./fixtures/tokens/micropage-inventory.json', import.meta.url), 'utf8')
const inventory = JSON.parse(inventoryText) as {
  source: { commit: string, date: string }
  modes: { count: number, default: string, forceLight: boolean }
  icons: { items: { name: string, inLibrary: boolean, action: string }[] }
  tokens: InventoryToken[]
}
const imported = (JSON.parse(readFileSync(new URL('./fixtures/tokens/imported-tokens.json', import.meta.url), 'utf8')) as { tokens: FlatTokens }).tokens

const colors = inventory.tokens.filter(token => token.path.startsWith('colors.'))

describe('design inventory fixture', () => {
  it('records one source commit and no links', () => {
    expect(inventory.source).toEqual({ commit: '03c549d', date: '2026-11-11' })
    expect(inventoryText).not.toMatch(/https?:|www\.|github|\.sh\b/i)
    expect(inventoryText).not.toMatch(new RegExp(['f', 'y', 'r', 's', 't'].join(''), 'i'))
  })

  it('gives every entry an origin and a planned action', () => {
    for (const token of inventory.tokens) {
      expect(['design-file', 'app-level'], token.path).toContain(token.origin)
      expect(['add', 'replace', 'keep', 'keep-library', 'publish-as', 'skip'], token.path).toContain(token.action)
      expect(token.publishedAs !== undefined, token.path).toBe(token.action === 'publish-as')
    }
  })

  it('lists the color tokens with exact paths', () => {
    const names = colors.map(token => token.path.slice('colors.'.length))
    expect(names.filter(name => name.startsWith('brand.'))).toHaveLength(10)
    for (const family of ['red', 'green', 'blue', 'yellow', 'grey']) {
      expect(names.filter(name => name.startsWith(`${family}.`)), family).toHaveLength(11)
    }
    expect(names).not.toContain('grey.75')
    expect(names).toEqual(expect.arrayContaining(['white', 'black', 'transparent', 'primary-pale', 'surface-raised', 'border-subtle', 'neutral-light']))
    expect(colors.filter(token => token.kind === 'semantic')).toHaveLength(17)
  })

  it('maps the three flat role names to the nested library names', () => {
    const publishAs = Object.fromEntries(inventory.tokens.filter(token => token.publishedAs).map(token => [token.path, token.publishedAs]))
    expect(publishAs).toEqual({
      'colors.surface-raised': 'colors.surface.raised',
      'colors.border-subtle': 'colors.border.subtle',
      'colors.neutral-light': 'colors.neutral.light',
    })
  })

  it('marks a token keep only when the library has the same value (hex case ignored)', () => {
    for (const token of inventory.tokens.filter(entry => entry.action === 'keep')) {
      const library = imported[token.path]
      expect(library, token.path).toBeDefined()
      expect(normalizeValue(token.resolved.light), token.path).toBe(normalizeValue(library!.light))
      expect(normalizeValue(token.resolved.dark), token.path).toBe(normalizeValue(library!.dark))
    }
  })

  it('has two modes with light as the default and no forced light', () => {
    expect(inventory.modes).toMatchObject({ count: 2, default: 'light', forceLight: false })
  })

  it('lists nine icons, six of them new', () => {
    expect(inventory.icons.items).toHaveLength(9)
    expect(inventory.icons.items.filter(icon => icon.action === 'add').map(icon => icon.name)).toEqual([
      'envelope-simple-bold',
      'package-bold',
      'puzzle-piece-bold',
      'shopping-cart-simple-bold',
      'storefront-bold',
      'wrench-bold',
    ])
  })
})
