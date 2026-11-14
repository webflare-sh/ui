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
