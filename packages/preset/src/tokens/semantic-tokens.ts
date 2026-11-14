import { defineSemanticTokens } from '@pandacss/dev'

/**
 * Light is the base. Dark applies inside a `.dark` class (`_dark`) and when the
 * OS prefers dark (`_osDark`), so every dark value is written under both.
 *
 * A value that references a mode-dependent token repeats the reference under
 * the dark conditions too. Otherwise the CSS variable is resolved once at the
 * root, and an element inside `.dark` would keep the light result.
 */
const mode = <T extends string>(light: T, dark: T) => ({ base: light, _dark: dark, _osDark: dark })

const subtleMix = (
  light: string,
  dark: string,
  status = '{opacity.color.status}',
  neutral = '{opacity.color.neutral}',
) => ({
  value: mode(
    `color-mix(in srgb, {colors.${light}} ${status}, {colors.grey.400} ${neutral})`,
    `color-mix(in srgb, {colors.${dark}} ${status}, {colors.grey.800} ${neutral})`,
  ),
})

export const opacity = defineSemanticTokens.opacity({
  color: {
    status: {
      DEFAULT: { value: mode('80%', '20%') },
      lighter: { value: '25%' },
    },
    neutral: {
      DEFAULT: { value: mode('5%', '80%') },
      lighter: { value: mode('25%', '20%') },
    },
  },
})

export const fonts = defineSemanticTokens.fonts({
  body: {
    value: '{fonts.sans}',
    description: 'Document face. Alias of the Figtree sans stack.',
  },
})

export const colors = defineSemanticTokens.colors({
  'primary': {
    value: '{colors.brand.400}',
    description: 'The brand color. Same in both modes.',
  },
  'primary-pale': {
    value: '{colors.brand.50}',
    description: 'Pale brand fill',
  },
  'danger': {
    DEFAULT: { value: mode('{colors.red.600}', '{colors.red.400}') },
    subtle: {
      DEFAULT: subtleMix('red.200', 'red.400'),
      light: subtleMix('red.400', 'red.200', '{opacity.color.status.lighter}', '{opacity.color.neutral.lighter}'),
    },
    text: { value: '{colors.red.900}' },
  },
  'success': {
    DEFAULT: { value: mode('{colors.green.600}', '{colors.green.400}') },
    subtle: {
      DEFAULT: subtleMix('green.200', 'green.400'),
      light: subtleMix('green.400', 'green.200', '{opacity.color.status.lighter}', '{opacity.color.neutral.lighter}'),
    },
    text: { value: '{colors.green.900}' },
  },
  'warning': {
    DEFAULT: { value: mode('{colors.yellow.600}', '{colors.yellow.400}') },
    subtle: {
      DEFAULT: subtleMix('yellow.200', 'yellow.400'),
      light: subtleMix('yellow.400', 'yellow.200', '{opacity.color.status.lighter}', '{opacity.color.neutral.lighter}'),
    },
    text: { value: '{colors.yellow.900}' },
  },
  'info': {
    DEFAULT: { value: mode('{colors.blue.600}', '{colors.blue.400}') },
    subtle: {
      DEFAULT: subtleMix('blue.200', 'blue.400'),
      light: subtleMix('blue.400', 'blue.200', '{opacity.color.status.lighter}', '{opacity.color.neutral.lighter}'),
    },
    text: { value: '{colors.blue.900}' },
  },
  'neutral': {
    DEFAULT: {
      value: mode('{colors.grey.800}', '{colors.white}'),
      description: 'Default text color',
    },
    inverse: { value: mode('{colors.white}', '{colors.grey.800}') },
    light: { value: '{colors.grey.400}' },
  },
  'surface': {
    DEFAULT: {
      value: mode('{colors.white}', '{colors.grey.950}'),
      description: 'Background of fields, menus, and dialogs',
    },
    raised: {
      value: mode('{colors.white}', '{colors.grey.900}'),
      description: 'Background of panels that sit on the page, such as the prompt form',
    },
  },
  'surface-muted': {
    value: mode('{colors.grey.50}', '{colors.grey.900}'),
    description: 'Muted page section background',
  },
  'border': {
    DEFAULT: {
      value: mode('{colors.grey.200}', '{colors.grey.600}'),
      description: 'Border of fields and menus',
    },
    hover: {
      value: mode('{colors.grey.300}', '{colors.grey.400}'),
      description: 'Border of a hovered field',
    },
    subtle: {
      value: mode('{colors.grey.100}', '{colors.grey.800}'),
      description: 'Dividers and dialog borders',
    },
  },
  'muted': {
    value: mode('{colors.neutral.light}', '{colors.grey.300}'),
    description: 'Secondary copy',
  },
  'text': {
    muted: {
      value: mode('{colors.muted}', '{colors.muted}'),
      description: 'Secondary copy: descriptions and helper text',
    },
  },
  'input-border': { value: mode('{colors.border}', '{colors.border}') },
  'input-bg': { value: mode('{colors.surface}', '{colors.surface}') },
  'input-disabled-bg': { value: mode('{colors.grey.50}', '{colors.grey.800}') },
  'input-color': { value: '{colors.grey.400}' },
  'accent-subtle': { value: mode('{colors.brand.50}', '#f879601a') },
  'accent-border': { value: mode('{colors.brand.100}', '#f8796040') },
  'accent-text': { value: mode('{colors.brand.600}', '{colors.brand.300}') },
})

/**
 * Focus rings point at color tokens. `card` and `float` change per mode and use
 * raw `rgb()` values, as on the website.
 */
export const shadows = defineSemanticTokens.shadows({
  'focus': { value: '0 0 0 4px color-mix(in srgb, {colors.primary} 30%, transparent)' },
  'focus-danger': { value: '0 0 0 4px color-mix(in srgb, {colors.red.600} 30%, transparent)' },
  'focus-success': { value: '0 0 0 4px color-mix(in srgb, {colors.green.600} 30%, transparent)' },
  'card': {
    value: mode(
      '0 1px 2px rgb(23 23 23 / 0.04), 0 12px 32px -12px rgb(23 23 23 / 0.12)',
      '0 1px 2px rgb(0 0 0 / 0.4), 0 12px 32px -12px rgb(0 0 0 / 0.6)',
    ),
  },
  'float': {
    value: mode(
      '0 2px 4px rgb(23 23 23 / 0.04), 0 32px 64px -24px rgb(23 23 23 / 0.22)',
      '0 2px 4px rgb(0 0 0 / 0.5), 0 32px 64px -24px rgb(0 0 0 / 0.8)',
    ),
  },
})
