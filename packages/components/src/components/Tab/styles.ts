import { sva } from 'styled-system/css'

export const tabStyles = sva({
  slots: ['root', 'item', 'icon'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '2xs',
      backgroundColor: 'surface',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'border.card',
      borderRadius: 'pill',
      padding: '2xs',
      position: 'relative',
      _after: {
        content: '""',
        position: 'absolute',
        positionAnchor: '--active-tab',
        bgColor: 'primary',
        transition: 'all 300ms',
        top: 'anchor(top)',
        left: 'anchor(left)',
        right: 'anchor(right)',
        bottom: 'anchor(bottom)',
        borderRadius: 'pill',
        zIndex: '0',
      },
    },
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'xs',
      paddingBlock: 'xs',
      paddingInline: 'lg',
      borderRadius: 'pill',
      fontSize: 'md',
      fontWeight: 'semibold',
      lineHeight: 'normal',
      color: 'neutral',
      cursor: 'pointer',
      position: 'relative',
      zIndex: '2',
      transitionProperty: 'background-color, color',
      transitionDuration: '200ms',
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
      // The hover fill is the same shade as the border of the tab bar.
      _hover: {
        bgColor: 'border.card',
      },
      _active: {
        anchorName: '--active-tab',
        color: 'neutral.inverse',
        _hover: {
          bgColor: 'transparent',
        },
      },
    },
    icon: {
      fontSize: 'lg',
    },
  },
})
