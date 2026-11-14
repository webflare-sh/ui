import { cva } from 'styled-system/css'

export const buttonStyles = cva({
  base: {
    display: 'inline flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    borderRadius: 'lg',
    borderStyle: 'solid',
    borderWidth: '1px',
    userSelect: 'none',
    transition: 'all 300ms',
    cursor: 'pointer',
    _disabled: {
      pointerEvents: 'none',
      opacity: '0.5',
    },
  },
  variants: {
    color: {
      // Brand states follow the website button: hover brand.500, then one
      // step darker (brand.600) for active.
      primary: {
        backgroundColor: 'primary',
        color: 'grey.800',
        borderColor: 'primary',
        _hover: {
          backgroundColor: 'brand.500',
          borderColor: 'brand.500',
        },
        _active: {
          backgroundColor: 'brand.600',
          borderColor: 'brand.600',
        },
      },
      // Light: pale brand fill (website "soft" button). Dark: grey fill.
      // The dark blocks repeat the state selectors so they beat the light
      // state colors on specificity.
      secondary: {
        'bg': 'primary-pale',
        'borderColor': 'primary-pale',
        'color': 'grey.800',
        '& .btn-icon': {
          color: 'grey.800',
        },
        '_hover': {
          backgroundColor: 'brand.100',
        },
        '_active': {
          backgroundColor: 'brand.200',
          borderColor: 'brand.200',
        },
        '_dark': {
          'bg': 'grey.800',
          'color': 'neutral',
          'borderColor': 'grey.600',
          '& .btn-icon': {
            color: 'primary',
          },
          '_hover': {
            backgroundColor: 'grey.700',
          },
          '_active': {
            backgroundColor: 'grey.950',
            borderColor: 'grey.600',
          },
        },
        '_osDark': {
          'bg': 'grey.800',
          'color': 'neutral',
          'borderColor': 'grey.600',
          '& .btn-icon': {
            color: 'primary',
          },
          '_hover': {
            backgroundColor: 'grey.700',
          },
          '_active': {
            backgroundColor: 'grey.950',
            borderColor: 'grey.600',
          },
        },
      },
      transparent: {
        'backgroundColor': 'transparent',
        'borderColor': 'transparent',
        'color': 'neutral',
        '& .btn-icon': {
          color: 'primary',
        },
        '& .btn-label': {
          textDecoration: 'underline',
          textDecorationColor: {
            base: 'black/50',
            _dark: 'white/50',
            _osDark: 'white/50',
          },
          textDecorationThickness: '1px',
          textUnderlineOffset: '25%',
        },
        '_hover': {
          backgroundColor: 'primary-pale',
        },
        '_active': {
          backgroundColor: 'brand.100',
        },
        '_dark': {
          _hover: {
            backgroundColor: 'grey.800',
          },
          _active: {
            backgroundColor: 'black',
          },
        },
        '_osDark': {
          _hover: {
            backgroundColor: 'grey.800',
          },
          _active: {
            backgroundColor: 'black',
          },
        },
      },
    },
    size: {
      sm: {
        fontSize: 'sm',
        gap: 'sm',
        paddingBlock: 'xs',
        paddingInline: 'lg',
      },
      md: {
        'fontSize': 'md',
        'gap': 'sm',
        'paddingBlock': 'sm',
        'paddingInline': 'lg',
        '& .btn-icon': {
          fontSize: 'lg',
        },
      },
      lg: {
        fontSize: 'lg',
        gap: 'md',
        paddingBlock: 'md',
        paddingInline: 'xl',
      },
    },
    fullWidth: {
      true: {
        width: '100%',
        boxSizing: 'border-box',
      },
      false: {},
    },
    order: {
      regular: {
        '& .btn-icon': {
          order: '1',
        },
        '& .btn-label': {
          order: '2',
        },
      },
      inverse: {
        '& .btn-icon': {
          order: '2',
        },
        '& .btn-label': {
          order: '1',
        },
      },
    },
  },
  defaultVariants: {
    color: 'secondary',
    size: 'md',
    order: 'regular',
    fullWidth: false,
  },
})
