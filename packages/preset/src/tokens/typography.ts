import { defineTokens } from '@pandacss/dev'

/**
 * Figtree is the brand sans. The package does not ship the font files.
 * `serif` and `mono` match the system stacks from `@pandacss/preset-panda`
 * so a design-system consumer is not missing those tokens.
 * Values are strings (not arrays) so a later `extend` replaces the stack
 * instead of appending to it.
 */
export const fonts = defineTokens.fonts({
  sans: {
    value: 'Figtree, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    description: 'Brand sans. Load the Figtree face in the app. Falls back to the system sans when the face is not available.',
  },
  serif: {
    value: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    description: 'System serif. This design system does not ship a brand serif face.',
  },
  mono: {
    value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    description: 'System monospace. This design system does not ship a brand mono face.',
  },
})

export const fontSizes = defineTokens.fontSizes({
  'xs': { value: '12px' },
  'sm': { value: '14px' },
  'md': { value: '16px' },
  'lg': { value: '20px' },
  'xl': { value: '24px' },
  '2xl': { value: '32px' },
  '3xl': { value: '40px' },
  '4xl': { value: '48px' },
  '5xl': { value: '64px' },
})

export const fontWeights = defineTokens.fontWeights({
  regular: { value: '400', description: 'Same weight as normal' },
  normal: { value: '400' },
  medium: { value: '500' },
  semibold: { value: '600' },
  bold: { value: '700' },
  extrabold: { value: '800' },
})

export const lineHeights = defineTokens.lineHeights({
  none: { value: '1' },
  heading: { value: '1.08' },
  tight: { value: '1.25' },
  normal: { value: '1.5' },
  relaxed: { value: '1.65' },
})

export const letterSpacings = defineTokens.letterSpacings({
  tighter: { value: '-0.035em' },
  tight: { value: '-0.02em' },
  normal: { value: '0' },
  wide: { value: '0.08em' },
})
