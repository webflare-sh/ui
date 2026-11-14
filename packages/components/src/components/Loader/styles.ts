import { cva } from 'styled-system/css'

/** Diameters with a `size` variant. `Loader` snaps other sizes to the closest one. */
export const loaderSizeValues = [16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120] as const

export type LoaderSizeValue = typeof loaderSizeValues[number]

export const loaderStyles = cva({
  base: {
    boxSizing: 'border-box',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderColor: 'loader.track',
    borderTopColor: 'primary',
    animationDuration: '1000ms',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    animationName: 'spin',
  },
  variants: {
    size: {
      16: {
        width: '16px',
        height: '16px',
        borderWidth: '2px',
      },
      20: {
        width: '20px',
        height: '20px',
        borderWidth: '2px',
      },
      24: {
        width: '24px',
        height: '24px',
        borderWidth: '2px',
      },
      32: {
        width: '32px',
        height: '32px',
        borderWidth: '3px',
      },
      40: {
        width: '40px',
        height: '40px',
        borderWidth: '4px',
      },
      48: {
        width: '48px',
        height: '48px',
        borderWidth: '5px',
      },
      56: {
        width: '56px',
        height: '56px',
        borderWidth: '6px',
      },
      64: {
        width: '64px',
        height: '64px',
        borderWidth: '6px',
      },
      80: {
        width: '80px',
        height: '80px',
        borderWidth: '8px',
      },
      96: {
        width: '96px',
        height: '96px',
        borderWidth: '10px',
      },
      120: {
        width: '120px',
        height: '120px',
        borderWidth: '12px',
      },
    },
  },
  defaultVariants: {
    size: 40,
  },
})
