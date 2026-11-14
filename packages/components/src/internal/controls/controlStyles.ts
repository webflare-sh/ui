import { cva } from 'styled-system/css'

/** Text-like field controls: input, textarea, and the select trigger. */
export const controlStyles = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    minWidth: '200px',
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
    fontFamily: 'inherit',
    lineHeight: '1.5',
    color: 'neutral',
    transition: 'all 300ms',
    _placeholder: {
      color: {
        base: 'black/75',
        _dark: 'white/75',
        _osDark: 'white/75',
      },
    },
    _hover: {
      borderColor: 'border.hover',
    },
    _focus: {
      outlineColor: 'primary/50',
      borderColor: 'primary',
    },
    _disabled: {
      opacity: '0.5',
      cursor: 'not-allowed',
    },
  },
  variants: {
    element: {
      input: {},
      textarea: {
        alignItems: 'flex-start',
        resize: 'vertical',
        minHeight: '6rem',
      },
      select: {
        justifyContent: 'space-between',
        gap: 'md',
        cursor: 'pointer',
        textAlign: 'left',
        _disabled: {
          cursor: 'not-allowed',
        },
      },
    },
    size: {
      sm: {
        paddingX: 'md',
        paddingY: 'xs',
        fontSize: 'sm',
      },
      md: {
        paddingX: 'lg',
        paddingY: 'sm',
        fontSize: 'md',
      },
      lg: {
        paddingX: 'xl',
        paddingY: 'md',
        fontSize: 'lg',
      },
    },
    valid: {
      true: {
        borderColor: 'success.subtle !important',
        _focus: {
          borderColor: 'success.subtle !important',
          outlineColor: 'success.subtle/50 !important',
        },
      },
      false: {
        borderColor: 'danger.subtle !important',
        _focus: {
          borderColor: 'danger.subtle !important',
          outlineColor: 'danger.subtle/50 !important',
        },
      },
      none: {},
    },
  },
  defaultVariants: {
    element: 'input',
    size: 'md',
    valid: 'none',
  },
})
