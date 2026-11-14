import { sva } from 'styled-system/css'

export const switchStyles = sva({
  slots: ['root', 'track', 'thumb', 'label'],
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
    track: {
      'transition': 'all 300ms',
      'overflow': 'hidden',
      'display': 'flex',
      'flexDir': 'row',
      'cursor': 'pointer',
      'justifyContent': 'start',
      'borderWidth': '1px',
      'borderStyle': 'solid',
      'borderColor': 'grey.300',
      'padding': '2px',
      'borderRadius': 'pill',
      'bgColor': 'grey.100',
      'flexShrink': '0',
      '_hover': {
        borderColor: 'grey.400',
      },
      '&[data-state="checked"]': {
        bgColor: 'primary',
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
      },
      '&[data-invalid]': {
        borderColor: 'danger.subtle',
      },
      // Repeat the state selectors inside `_dark` / `_osDark` so they still
      // beat the dark-mode track colors on specificity.
      '_dark': {
        'borderColor': 'grey.300/75',
        'bgColor': 'grey.950',
        '_hover': {
          borderColor: 'grey.400',
        },
        '&[data-state="checked"]': {
          bgColor: 'primary',
        },
        '&[data-invalid]': {
          borderColor: 'danger.subtle',
        },
      },
      '_osDark': {
        'borderColor': 'grey.300/75',
        'bgColor': 'grey.950',
        '_hover': {
          borderColor: 'grey.400',
        },
        '&[data-state="checked"]': {
          bgColor: 'primary',
        },
        '&[data-invalid]': {
          borderColor: 'danger.subtle',
        },
      },
    },
    thumb: {
      transition: 'all 300ms',
      aspectRatio: '1',
      display: 'block',
      borderRadius: 'pill',
      bgColor: 'white',
      translate: 'auto',
      translateX: '0',
      shadow: '0 0 16px var(--shadow-color)',
      shadowColor: {
        base: 'grey.400',
        _dark: 'grey.950',
        _osDark: 'grey.950',
      },
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
        track: {
          width: '32px',
        },
        thumb: {
          'width': '12px',
          '[data-state="checked"] &': {
            translateX: '14px',
          },
        },
        label: {
          fontSize: 'sm',
        },
      },
      md: {
        track: {
          width: '40px',
        },
        thumb: {
          'width': '16px',
          '[data-state="checked"] &': {
            translateX: '18px',
          },
        },
        label: {
          fontSize: 'md',
        },
      },
      lg: {
        track: {
          width: '48px',
        },
        thumb: {
          'width': '20px',
          '[data-state="checked"] &': {
            translateX: '22px',
          },
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
