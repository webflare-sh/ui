import { sva } from 'styled-system/css'

/** Discrete border widths in px. `CardRoot` snaps other values to `1`. */
export const cardBorderSizes = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const

export type CardBorderSize = typeof cardBorderSizes[number]

export const cardStyles = sva({
  slots: ['root', 'header', 'headerBody', 'headerTitle', 'headerSubtitle', 'body', 'footer'],
  base: {
    root: {
      'color': 'neutral',
      'display': 'block',
      'borderStyle': 'solid',
      'borderColor': 'transparent',
      'position': 'relative',
      'zIndex': '1',
      'maxWidth': '100%',
      'backdropBlur': '8px',
      'backdropFilter': 'auto',
      'boxShadow': 'var(--card-shadow)',
      '--card-bg-overlay': 'linear-gradient(transparent)',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'center',
      borderStyle: 'solid',
      borderColor: 'var(--card-border-color)',
    },
    headerBody: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
    },
    headerTitle: {
      fontWeight: '700',
      fontSize: 'lg',
      lineHeight: '1.25',
    },
    headerSubtitle: {
      color: 'text.muted',
      fontSize: 'md',
    },
  },
  variants: {
    colorStrategy: {
      default: {
        root: {
          // `[…]` marks a raw value: a layered shorthand built from CSS variables.
          background: '[var(--card-bg-overlay) padding-box, var(--card-bg) padding-box]',
          borderColor: 'var(--card-border-color)',
        },
      },
      image: {
        root: {
          background: '[var(--card-bg-overlay) padding-box, var(--card-bg) padding-box, var(--card-border-color) border-box]',
        },
      },
    },
    color: {
      'none': {
        root: {
          '--card-bg': 'transparent',
          '--card-border-color': 'transparent',
        },
      },
      'default': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.surface.raised))',
          '--card-border-color': 'token(colors.border.card)',
        },
      },
      'primary': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.primary/10))',
        },
      },
      'danger': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.danger.subtle/10))',
        },
      },
      'success': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.success.subtle/10))',
        },
      },
      'warning': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.warning.subtle/10))',
        },
      },
      'info': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.info.subtle/10))',
        },
      },
      'lucid-deep': {
        root: {
          '--card-bg': 'linear-gradient(token(colors.black/10))',
        },
      },
    },
    padding: {
      md: {
        header: {
          padding: 'xl',
          gap: 'md',
        },
        body: {
          padding: 'xl',
        },
      },
    },
    borderSize: {
      0: {
        root: {
          borderWidth: '0px',
        },
        header: {
          borderBottomWidth: '0px',
        },
      },
      1: {
        root: {
          borderWidth: '1px',
        },
        header: {
          borderBottomWidth: '1px',
        },
      },
      2: {
        root: {
          borderWidth: '2px',
        },
        header: {
          borderBottomWidth: '2px',
        },
      },
      3: {
        root: {
          borderWidth: '3px',
        },
        header: {
          borderBottomWidth: '3px',
        },
      },
      4: {
        root: {
          borderWidth: '4px',
        },
        header: {
          borderBottomWidth: '4px',
        },
      },
      5: {
        root: {
          borderWidth: '5px',
        },
        header: {
          borderBottomWidth: '5px',
        },
      },
      6: {
        root: {
          borderWidth: '6px',
        },
        header: {
          borderBottomWidth: '6px',
        },
      },
      7: {
        root: {
          borderWidth: '7px',
        },
        header: {
          borderBottomWidth: '7px',
        },
      },
      8: {
        root: {
          borderWidth: '8px',
        },
        header: {
          borderBottomWidth: '8px',
        },
      },
    },
    borderRadius: {
      sm: {
        root: {
          borderRadius: 'lg',
        },
      },
      md: {
        root: {
          borderRadius: 'xl',
        },
      },
      lg: {
        root: {
          borderRadius: '2xl',
        },
      },
      xl: {
        root: {
          borderRadius: '4xl',
        },
      },
    },
  },
  defaultVariants: {
    borderRadius: 'md',
    borderSize: 1,
    color: 'default',
    padding: 'md',
    colorStrategy: 'default',
  },
})
