import { sva } from 'styled-system/css'

export const alertStyles = sva({
  slots: ['root', 'icon', 'content', 'message', 'title', 'description', 'close'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'flex-start',
      borderWidth: '1px',
      borderStyle: 'solid',
    },
    icon: {},
    content: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minWidth: 0,
    },
    message: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2xs',
    },
    title: {
      fontWeight: '700',
      lineHeight: '1.25',
    },
    description: {
      fontWeight: '500',
      lineHeight: '1.5',
    },
    close: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: 'lg',
      height: 'lg',
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: 'neutral.light',
      borderRadius: 'sm',
      transition: 'all 200ms',
      _hover: {
        color: 'neutral',
        bg: {
          base: 'black/17.5',
          _dark: 'white/17.5',
          _osDark: 'white/17.5',
        },
      },
      _active: {
        bg: {
          base: 'black/25',
          _dark: 'white/25',
          _osDark: 'white/25',
        },
      },
    },
  },
  variants: {
    variant: {
      danger: {
        root: {
          bg: 'danger.subtle/15',
          borderColor: 'danger.subtle/20',
        },
        icon: {
          color: 'danger.subtle',
        },
        title: {
          color: 'danger.subtle',
        },
        description: {
          color: 'danger.subtle',
        },
      },
      success: {
        root: {
          bg: 'success.subtle/15',
          borderColor: 'success.subtle/20',
        },
        icon: {
          color: 'success.subtle',
        },
        title: {
          color: 'success.subtle',
        },
        description: {
          color: 'success.subtle',
        },
      },
      info: {
        root: {
          bg: 'info.subtle/15',
          borderColor: 'info.subtle/20',
        },
        icon: {
          color: 'info.subtle',
        },
        title: {
          color: 'info.subtle',
        },
        description: {
          color: 'info.subtle',
        },
      },
      warning: {
        root: {
          bg: 'warning.subtle/15',
          borderColor: 'warning.subtle/20',
        },
        icon: {
          color: 'warning.subtle',
        },
        title: {
          color: 'warning.subtle',
        },
        description: {
          color: 'warning.subtle',
        },
      },
    },
    borderSize: {
      md: {
        root: {
          borderRadius: 'md',
        },
      },
      lg: {
        root: {
          borderRadius: 'lg',
        },
      },
      xl: {
        root: {
          borderRadius: '2xl',
        },
      },
    },
    iconSize: {
      md: {},
      lg: {
        icon: {
          fontSize: 'lg',
        },
      },
      xl: {
        icon: {
          fontSize: 'xl',
        },
      },
    },
    textSize: {
      md: {
        title: {
          fontSize: 'md',
        },
        description: {
          fontSize: 'sm',
        },
      },
      lg: {
        title: {
          fontSize: 'lg',
        },
        description: {
          fontSize: 'md',
        },
      },
    },
    spacing: {
      md: {
        root: {
          gap: 'sm',
          padding: 'md',
        },
        content: {
          gap: 'sm',
        },
      },
      lg: {
        root: {
          gap: 'lg',
          padding: 'xl',
        },
        content: {
          gap: 'sm',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'info',
    textSize: 'md',
    borderSize: 'md',
    spacing: 'md',
    iconSize: 'xl',
  },
})
