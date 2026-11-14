import { sva } from 'styled-system/css'

/** URL field: clickable protocol prefix plus host/path input. */
export const urlStyles = sva({
  slots: ['root', 'protocol', 'input'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      minWidth: '200px',
      paddingX: '0',
      paddingY: '0',
      gap: '0',
      overflow: 'hidden',
      backgroundColor: 'surface',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'lg',
      outlineWidth: '3px',
      outlineColor: 'transparent',
      outlineOffset: '0px',
      outlineStyle: 'solid',
      fontWeight: '450',
      lineHeight: '1.5',
      color: 'neutral',
      transition: 'all 300ms',
      _hover: {
        borderColor: 'border.hover',
      },
      _focus: {
        outlineColor: 'transparent',
      },
      _focusWithin: {
        outlineColor: 'primary/50',
        borderColor: 'primary',
      },
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    protocol: {
      'display': 'inline-flex',
      'alignItems': 'center',
      'gap': '2xs',
      'flexShrink': 0,
      'margin': '0',
      'border': 'none',
      'borderRadius': '0',
      'backgroundColor': 'neutral.subtle',
      'color': 'inherit',
      'font': 'inherit',
      'fontWeight': '450',
      'lineHeight': '1.5',
      'whiteSpace': 'nowrap',
      'cursor': 'pointer',
      '_hover': {
        opacity: '0.9',
      },
      '_focusVisible': {
        outlineWidth: '2px',
        outlineStyle: 'solid',
        outlineColor: 'primary',
        outlineOffset: '-2px',
        borderRadius: 'md',
      },
      '_disabled': {
        cursor: 'not-allowed',
        opacity: '1',
      },
      '& .icon': {
        fontSize: '0.9em',
      },
    },
    input: {
      flex: '1',
      minWidth: '0',
      width: '100%',
      margin: '0',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: 'inherit',
      font: 'inherit',
      fontWeight: '450',
      lineHeight: '1.5',
      _placeholder: {
        color: 'text.placeholder',
      },
      _disabled: {
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          fontSize: 'sm',
        },
        protocol: {
          paddingInline: 'sm',
          paddingBlock: 'xs',
        },
        input: {
          paddingInlineStart: 'sm',
          paddingInlineEnd: 'md',
          paddingBlock: 'xs',
        },
      },
      md: {
        root: {
          fontSize: 'md',
        },
        protocol: {
          paddingInline: 'sm',
          paddingBlock: 'sm',
        },
        input: {
          paddingInlineStart: 'sm',
          paddingInlineEnd: 'lg',
          paddingBlock: 'sm',
        },
      },
      lg: {
        root: {
          fontSize: 'lg',
        },
        protocol: {
          paddingInline: 'md',
          paddingBlock: 'md',
        },
        input: {
          paddingInlineStart: 'md',
          paddingInlineEnd: 'xl',
          paddingBlock: 'md',
        },
      },
    },
    valid: {
      true: {
        root: {
          borderColor: 'success.subtle !important',
          _focusWithin: {
            borderColor: 'success.subtle !important',
            outlineColor: 'success.subtle/50 !important',
          },
        },
      },
      false: {
        root: {
          borderColor: 'danger.subtle !important',
          _focusWithin: {
            borderColor: 'danger.subtle !important',
            outlineColor: 'danger.subtle/50 !important',
          },
        },
      },
      none: {},
    },
    secure: {
      true: {
        protocol: {
          '& .icon': {
            color: 'success.subtle',
          },
        },
      },
      false: {
        protocol: {
          '& .icon': {
            color: 'text.placeholder',
          },
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    valid: 'none',
    secure: true,
  },
})
