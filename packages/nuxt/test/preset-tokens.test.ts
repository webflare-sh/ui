import { describe, expect, it } from 'vitest'
import presetBase from '@pandacss/preset-base'
import { preset } from '../../preset/src/index.ts'
import { fonts } from '../../preset/src/tokens/tokens.ts'
import { colors, fonts as semanticFonts } from '../../preset/src/tokens/semantic-tokens.ts'

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

  it('matches the color tokens', () => {
    expect(colors.brand.pale).toEqual({ value: '{colors.brand.100}' })
    expect(colors.primary).toEqual({
      value: { base: '{colors.brand.pale}', _light: '{colors.brand.day}' },
    })
    expect(colors.primary).not.toHaveProperty('subtle')
    expect(colors.primary).not.toHaveProperty('text')
    expect(colors.primary).not.toHaveProperty('lucid')

    for (const name of ['danger', 'success', 'warning', 'info'] as const) {
      expect(colors[name].subtle).toBeTruthy()
      expect(colors[name].text).toBeTruthy()
      expect(colors[name]).not.toHaveProperty('lucid')
    }
  })
})
