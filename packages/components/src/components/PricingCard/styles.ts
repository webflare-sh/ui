import { sva } from 'styled-system/css'

export const pricingCardStyles = sva({
  slots: ['root', 'header', 'headerPackage', 'title', 'subtitle', 'pricing', 'price', 'badge'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      maxWidth: '100%',
      color: 'neutral',
      backgroundColor: 'surface',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: {
        base: 'grey.100',
        _dark: 'grey.700',
        _osDark: 'grey.700',
      },
      borderRadius: 'md',
      position: 'relative',
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'transparent',
      transition: 'all 300ms',
      _hover: {
        borderColor: 'grey.400',
      },
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'sm',
      padding: 'lg',
      _hasNext: {
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: {
          base: 'grey.100',
          _dark: 'grey.700',
          _osDark: 'grey.700',
        },
      },
    },
    headerPackage: {
      display: 'flex',
      flexDir: 'column',
    },
    title: {
      fontSize: 'lg',
      fontWeight: '700',
    },
    subtitle: {
      fontSize: 'md',
      color: 'text.muted',
    },
    pricing: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 'sm',
    },
    price: {
      fontSize: '2xl',
      fontWeight: '600',
    },
    badge: {
      pos: 'absolute',
      bottom: '100%',
      left: '50%',
      translate: 'auto',
      translateX: '-1/2',
      translateY: '1/2',
      display: 'inline-flex',
      bg: 'primary',
      color: 'neutral.inverse',
      borderRadius: 'pill',
      paddingBlock: '2xs',
      paddingInline: 'md',
      fontSize: 'sm',
      fontWeight: 'semibold',
    },
  },
  variants: {
    highlight: {
      true: {
        root: {
          borderColor: 'primary',
          outlineColor: 'primary',
        },
      },
    },
  },
  defaultVariants: {
    highlight: false,
  },
})
