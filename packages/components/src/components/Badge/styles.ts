import { cva } from 'styled-system/css'

export const badgeStyles = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    lineHeight: '1.2',
    borderRadius: 'pill',
    userSelect: 'none',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    transition: 'all 300ms',
  },
  variants: {
    color: {
      default: {
        backgroundColor: 'neutral.subtle',
        color: 'neutral',
        borderColor: 'border',
      },
      primary: {
        backgroundColor: 'primary',
        color: 'grey.800',
        borderColor: 'primary',
      },
      success: {
        backgroundColor: 'success.subtle',
        color: {
          base: 'success.text',
          _dark: 'white',
          _osDark: 'white',
        },
        borderColor: 'success.subtle.light',
      },
      info: {
        backgroundColor: 'info.subtle',
        color: {
          base: 'info.text',
          _dark: 'white',
          _osDark: 'white',
        },
        borderColor: 'info.subtle.light',
      },
      danger: {
        backgroundColor: 'danger.subtle',
        color: {
          base: 'danger.text',
          _dark: 'white',
          _osDark: 'white',
        },
        borderColor: 'danger.subtle.light',
      },
    },
    size: {
      sm: {
        fontSize: {
          base: 'xs',
          lg: 'sm',
        },
        gap: {
          base: 'xs',
        },
        paddingBlock: {
          base: '2xs',
        },
        paddingInline: {
          base: 'sm',
        },
      },
      md: {
        fontSize: {
          base: 'sm',
          lg: 'md',
        },
        gap: {
          base: 'xs',
          lg: 'sm',
        },
        paddingBlock: {
          base: 'xs',
          lg: 'sm',
        },
        paddingInline: {
          base: 'md',
          lg: 'lg',
        },
      },
      lg: {
        fontSize: {
          base: 'md',
          lg: 'lg',
        },
        gap: {
          base: 'sm',
          lg: 'md',
        },
        paddingBlock: {
          base: 'sm',
          lg: 'md',
        },
        paddingInline: {
          base: 'lg',
          lg: 'xl',
        },
      },
    },
  },
  defaultVariants: {
    color: 'default',
    size: 'md',
  },
})
