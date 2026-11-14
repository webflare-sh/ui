import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(import.meta.dirname, '../src/styles/icons.css'), 'utf8')
const classes = new Set([...css.matchAll(/^\.(icon-[a-z0-9-]+)\s*\{/gm)].map(match => match[1]))

/** Public `.icon-*` class names shipped since the first release. Do not rename or remove. */
const existingIcons = [
  'arrow-left',
  'arrow-left-bold',
  'arrow-right',
  'arrow-right-bold',
  'arrow-up',
  'arrow-up-bold',
  'arrow-down',
  'arrow-down-bold',
  'caret-down',
  'caret-down-bold',
  'caret-up',
  'caret-up-bold',
  'caret-left',
  'caret-left-bold',
  'caret-right',
  'caret-right-bold',
  'check-bold',
  'check-circle',
  'check-circle-bold',
  'circle-wavy-warning',
  'circle-wavy-warning-bold',
  'info',
  'info-bold',
  'warning',
  'warning-bold',
  'x',
  'x-bold',
  'lock-simple-bold',
  'lock-simple-open-bold',
]

const addedIcons = [
  'envelope-simple-bold',
  'package-bold',
  'puzzle-piece-bold',
  'shopping-cart-simple-bold',
  'storefront-bold',
  'wrench-bold',
]

describe('icon stylesheet', () => {
  it('keeps every existing .icon-* class', () => {
    expect(existingIcons).toHaveLength(29)
    for (const name of existingIcons) {
      expect(classes, `.icon-${name}`).toContain(`icon-${name}`)
    }
  })

  it('has the added .icon-* classes', () => {
    for (const name of addedIcons) {
      expect(classes, `.icon-${name}`).toContain(`icon-${name}`)
    }
  })

  it('has exactly the existing and added icons', () => {
    expect([...classes].sort()).toEqual([...existingIcons, ...addedIcons].map(name => `icon-${name}`).sort())
  })

  it('renders every icon as a single-color CSS mask', () => {
    expect(css).toMatch(/^\.icon \{[^}]*mask-image: var\(--svg\);/m)
    expect(css).toMatch(/^\.icon \{[^}]*background-color: currentColor;/m)
  })
})
