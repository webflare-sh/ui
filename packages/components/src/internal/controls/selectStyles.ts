import { sva } from 'styled-system/css'

/** Select menu. The trigger uses `controlStyles` with `element: 'select'`. */
export const selectStyles = sva({
  slots: ['content', 'viewport', 'item', 'itemIndicator'],
  base: {
    content: {
      zIndex: '50',
      overflow: 'hidden',
      backgroundColor: 'surface',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'lg',
      boxShadow: 'lg',
      minWidth: 'var(--reka-select-trigger-width)',
      maxHeight: '18rem',
    },
    viewport: {
      p: 'xs',
    },
    item: {
      'display': 'flex',
      'alignItems': 'center',
      'gap': 'sm',
      'borderRadius': 'md',
      'paddingX': 'md',
      'paddingY': 'sm',
      'paddingLeft': '2rem',
      'fontSize': 'md',
      'fontWeight': '450',
      'color': 'neutral',
      'cursor': 'pointer',
      'outline': 'none',
      'userSelect': 'none',
      'position': 'relative',
      '&[data-highlighted]': {
        backgroundColor: 'neutral.subtle',
      },
      '&[data-disabled]': {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    itemIndicator: {
      position: 'absolute',
      left: 'md',
      display: 'inline-flex',
      width: '1em',
      color: 'primary',
    },
  },
})
