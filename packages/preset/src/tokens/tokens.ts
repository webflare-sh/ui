import { defineTokens } from '@pandacss/dev'

export const colors = defineTokens.colors({
  white: {
    value: '#FFFFFF',
    description: 'This is the primary white color used in our design system',
  },
  black: {
    value: '#000000',
    description: 'This is the primary black color used in our design system',
  },
  transparent: {
    value: '#00000000',
    description: 'This is the transparent color used in our design system',
  },
  brand: {
    50: {
      value: '#FDF1EB',
      description: 'Lightest brand tint, referenced as primary-pale',
    },
    100: {
      value: '#FFD9CE',
    },
    200: {
      value: '#FFBAAA',
    },
    300: {
      value: '#FD9B85',
    },
    400: {
      value: '#f87960',
      description: 'The Webflare brand color, referenced as primary',
    },
    500: {
      value: '#E75F45',
    },
    600: {
      value: '#C6543F',
    },
    700: {
      value: '#A44C3B',
    },
    800: {
      value: '#834235',
    },
    900: {
      value: '#66382E',
    },
  },
  red: {
    50: {
      value: '#fef2f2',
    },
    100: {
      value: '#fee2e2',
    },
    200: {
      value: '#fecaca',
    },
    300: {
      value: '#fca5a5',
    },
    400: {
      value: '#f87171',
    },
    500: {
      value: '#ef4444',
    },
    600: {
      value: '#dc2626',
    },
    700: {
      value: '#b91c1c',
    },
    800: {
      value: '#991b1b',
    },
    900: {
      value: '#7f1d1d',
    },
    950: {
      value: '#450a0a',
    },
  },
  green: {
    50: {
      value: '#f0fdf4',
    },
    100: {
      value: '#dcfce7',
    },
    200: {
      value: '#bbf7d0',
    },
    300: {
      value: '#86efac',
    },
    400: {
      value: '#4ade80',
    },
    500: {
      value: '#22c55e',
    },
    600: {
      value: '#16a34a',
    },
    700: {
      value: '#15803d',
    },
    800: {
      value: '#166534',
    },
    900: {
      value: '#14532d',
    },
    950: {
      value: '#052e16',
    },
  },
  blue: {
    50: {
      value: '#eff6ff',
    },
    100: {
      value: '#dbeafe',
    },
    200: {
      value: '#bfdbfe',
    },
    300: {
      value: '#93c5fd',
    },
    400: {
      value: '#60a5fa',
    },
    500: {
      value: '#3b82f6',
    },
    600: {
      value: '#2563eb',
    },
    700: {
      value: '#1d4ed8',
    },
    800: {
      value: '#1e40af',
    },
    900: {
      value: '#1e3a8a',
    },
    950: {
      value: '#172554',
    },
  },
  yellow: {
    50: {
      value: '#fffbeb',
    },
    100: {
      value: '#fef3c7',
    },
    200: {
      value: '#fde68a',
    },
    300: {
      value: '#fcd34d',
    },
    400: {
      value: '#fbbf24',
    },
    500: {
      value: '#f59e0b',
    },
    600: {
      value: '#d97706',
    },
    700: {
      value: '#b45309',
    },
    800: {
      value: '#92400e',
    },
    900: {
      value: '#78350f',
    },
    950: {
      value: '#451a03',
    },
  },
  grey: {
    50: {
      value: '#fafafa',
    },
    100: {
      value: '#e5e5e5',
    },
    200: {
      value: '#d4d4d4',
    },
    300: {
      value: '#a3a3a3',
    },
    400: {
      value: '#737373',
    },
    500: {
      value: '#525252',
    },
    600: {
      value: '#404040',
    },
    700: {
      value: '#333333',
    },
    800: {
      value: '#262626',
    },
    900: {
      value: '#1d1d1d',
    },
    950: {
      value: '#171717',
      description: 'This is the darkest grey color in our design system and replaces black',
    },
  },
})

export const spacing = defineTokens.spacing({
  '3xs': { value: '2px' },
  '2xs': { value: '4px' },
  'xs': { value: '8px' },
  'sm': { value: '12px' },
  'md': { value: '16px' },
  'lg': { value: '20px' },
  'xl': { value: '24px' },
  '2xl': { value: '32px' },
  '3xl': { value: '40px' },
  '4xl': { value: '48px' },
  '5xl': { value: '56px' },
  '6xl': { value: '64px' },
  '7xl': { value: '72px' },
  '8xl': { value: '80px' },
  '9xl': { value: '96px' },
  '10xl': { value: '128px' },
  '11xl': { value: '144px' },
  '12xl': { value: '160px' },
})

export const radii = defineTokens.radii({
  'sm': { value: '4px' },
  'md': { value: '6px' },
  'lg': { value: '10px' },
  'xl': { value: '16px' },
  '2xl': { value: '20px' },
  '3xl': { value: '24px' },
  '4xl': { value: '32px' },
  '5xl': { value: '40px' },
  'pill': { value: '99rem' },
})

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

export const breakpoints = {
  '3xs': '360px',
  '2xs': '420px',
  'xs': '520px',
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1440px',
  '3xl': '1640px',
  '4xl': '1920px',
}
