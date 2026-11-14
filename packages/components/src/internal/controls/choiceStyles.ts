import { sva } from 'styled-system/css'

/** Checkbox: label wrapper, box, check indicator, text. */
export const checkboxStyles = sva({
  slots: ['root', 'control', 'indicator', 'label'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'sm',
      cursor: 'pointer',
      userSelect: 'none',
      _disabled: {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    control: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'borderWidth': '1px',
      'borderStyle': 'solid',
      'borderColor': 'border',
      'backgroundColor': 'surface',
      'transition': 'all 200ms',
      'flexShrink': '0',
      '_enabled': {
        _hover: {
          borderColor: 'border.hover',
        },
      },
      '_invalid': {
        borderColor: 'danger.subtle',
      },
      'borderRadius': 'sm',
      'color': 'neutral',
      '&[data-state="checked"]': {
        backgroundColor: 'primary',
        borderColor: 'primary',
        color: 'grey.800',
      },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    label: {
      fontWeight: '500',
      color: 'neutral',
      lineHeight: '1.4',
    },
  },
  variants: {
    size: {
      sm: {
        control: {
          width: '1rem',
          height: '1rem',
        },
        label: {
          fontSize: 'sm',
        },
      },
      md: {
        control: {
          width: '1.125rem',
          height: '1.125rem',
        },
        label: {
          fontSize: 'md',
        },
      },
      lg: {
        control: {
          width: '1.375rem',
          height: '1.375rem',
        },
        label: {
          fontSize: 'lg',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

/** Radio group: shares the box, label, and size scale with the checkbox. */
export const radioGroupStyles = sva({
  slots: ['root', 'item', 'control', 'indicator', 'label'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      border: 'none',
      p: 0,
      m: 0,
      minWidth: '0',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: 'sm',
      cursor: 'pointer',
      userSelect: 'none',
      _disabled: {
        cursor: 'not-allowed',
        opacity: '0.5',
      },
    },
    control: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'borderWidth': '1px',
      'borderStyle': 'solid',
      'borderColor': 'border',
      'backgroundColor': 'surface',
      'transition': 'all 200ms',
      'flexShrink': '0',
      '_enabled': {
        _hover: {
          borderColor: 'border.hover',
        },
      },
      '_invalid': {
        borderColor: 'danger.subtle',
      },
      '&[data-state="checked"]': {
        borderColor: 'primary',
      },
      'borderRadius': 'full',
    },
    indicator: {
      display: 'block',
      width: '55%',
      height: '55%',
      borderRadius: 'full',
      backgroundColor: 'primary',
    },
    label: {
      fontWeight: '500',
      color: 'neutral',
      lineHeight: '1.4',
    },
  },
  variants: {
    size: {
      sm: {
        control: {
          width: '1rem',
          height: '1rem',
        },
        label: {
          fontSize: 'sm',
        },
      },
      md: {
        control: {
          width: '1.125rem',
          height: '1.125rem',
        },
        label: {
          fontSize: 'md',
        },
      },
      lg: {
        control: {
          width: '1.375rem',
          height: '1.375rem',
        },
        label: {
          fontSize: 'lg',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
