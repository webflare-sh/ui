import { sva } from 'styled-system/css'

export const listStyles = sva({
  slots: ['list', 'item', 'marker'],
  base: {
    list: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
    item: {
      display: 'inline-flex',
    },
    marker: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '5xl',
      flexBasis: 'auto',
      flexGrow: '0',
    },
  },
  variants: {
    size: {
      sm: {
        list: {
          gap: 'xs',
        },
        item: {
          fontSize: 'sm',
          gap: 'sm',
        },
        marker: {
          'width': '16px',
          'height': '16px',
          'minWidth': '16px',
          'marginTop': '2px',
          '& .icon': {
            fontSize: '10px',
          },
        },
      },
      md: {
        list: {
          gap: 'xs',
        },
        item: {
          fontSize: 'md',
          gap: 'sm',
        },
        marker: {
          'width': '20px',
          'height': '20px',
          'minWidth': '20px',
          'marginTop': '2px',
          '& .icon': {
            fontSize: '12px',
          },
        },
      },
      lg: {
        list: {
          gap: 'xs',
        },
        item: {
          fontSize: 'lg',
          gap: 'sm',
        },
        marker: {
          'width': '20px',
          'height': '20px',
          'minWidth': '20px',
          'marginTop': '6px',
          '& .icon': {
            fontSize: '12px',
          },
        },
      },
    },
    state: {
      default: {
        marker: {
          color: 'text.muted',
          backgroundColor: 'neutral.subtle',
        },
      },
      primary: {
        marker: {
          color: 'primary',
          backgroundColor: 'primary/10',
        },
      },
      success: {
        marker: {
          color: 'success.subtle',
          backgroundColor: 'success.subtle/10',
        },
      },
      danger: {
        marker: {
          color: 'danger.subtle',
          backgroundColor: 'danger.subtle/10',
        },
      },
      info: {
        marker: {
          color: 'info.subtle',
          backgroundColor: 'info.subtle/10',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
    state: 'default',
  },
})
