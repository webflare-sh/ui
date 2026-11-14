import { sva } from 'styled-system/css'

export const progressStyles = sva({
  slots: ['root', 'track', 'indicator', 'value'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'xs',
      width: '100%',
    },
    track: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      borderRadius: 'pill',
      bgColor: 'grey.700',
    },
    indicator: {
      'height': '100%',
      'borderRadius': 'pill',
      'transition': 'width 300ms ease',
      'width': '0%',
      '&[data-state="indeterminate"]': {
        width: '40%',
        animationStyle: 'progressIndeterminate',
      },
    },
    value: {
      fontWeight: '600',
      lineHeight: '1.2',
      color: 'text.muted',
    },
  },
  variants: {
    size: {
      sm: {
        track: {
          height: '3px',
        },
        value: {
          paddingInline: '2xs',
          fontSize: 'sm',
        },
      },
      md: {
        track: {
          height: '6px',
        },
        value: {
          paddingInline: '2xs',
          fontSize: 'sm',
        },
      },
      lg: {
        track: {
          height: '12px',
        },
        value: {
          paddingInline: '2xs',
          fontSize: 'md',
        },
      },
    },
    color: {
      primary: {
        indicator: {
          bgColor: 'primary',
        },
      },
      success: {
        indicator: {
          bgColor: 'success.subtle',
        },
      },
      danger: {
        indicator: {
          bgColor: 'danger.subtle',
        },
      },
      info: {
        indicator: {
          bgColor: 'info.subtle',
        },
      },
    },
    percent: {
      0: {
        indicator: {
          width: '0%',
        },
      },
      1: {
        indicator: {
          width: '1%',
        },
      },
      2: {
        indicator: {
          width: '2%',
        },
      },
      3: {
        indicator: {
          width: '3%',
        },
      },
      4: {
        indicator: {
          width: '4%',
        },
      },
      5: {
        indicator: {
          width: '5%',
        },
      },
      6: {
        indicator: {
          width: '6%',
        },
      },
      7: {
        indicator: {
          width: '7%',
        },
      },
      8: {
        indicator: {
          width: '8%',
        },
      },
      9: {
        indicator: {
          width: '9%',
        },
      },
      10: {
        indicator: {
          width: '10%',
        },
      },
      11: {
        indicator: {
          width: '11%',
        },
      },
      12: {
        indicator: {
          width: '12%',
        },
      },
      13: {
        indicator: {
          width: '13%',
        },
      },
      14: {
        indicator: {
          width: '14%',
        },
      },
      15: {
        indicator: {
          width: '15%',
        },
      },
      16: {
        indicator: {
          width: '16%',
        },
      },
      17: {
        indicator: {
          width: '17%',
        },
      },
      18: {
        indicator: {
          width: '18%',
        },
      },
      19: {
        indicator: {
          width: '19%',
        },
      },
      20: {
        indicator: {
          width: '20%',
        },
      },
      21: {
        indicator: {
          width: '21%',
        },
      },
      22: {
        indicator: {
          width: '22%',
        },
      },
      23: {
        indicator: {
          width: '23%',
        },
      },
      24: {
        indicator: {
          width: '24%',
        },
      },
      25: {
        indicator: {
          width: '25%',
        },
      },
      26: {
        indicator: {
          width: '26%',
        },
      },
      27: {
        indicator: {
          width: '27%',
        },
      },
      28: {
        indicator: {
          width: '28%',
        },
      },
      29: {
        indicator: {
          width: '29%',
        },
      },
      30: {
        indicator: {
          width: '30%',
        },
      },
      31: {
        indicator: {
          width: '31%',
        },
      },
      32: {
        indicator: {
          width: '32%',
        },
      },
      33: {
        indicator: {
          width: '33%',
        },
      },
      34: {
        indicator: {
          width: '34%',
        },
      },
      35: {
        indicator: {
          width: '35%',
        },
      },
      36: {
        indicator: {
          width: '36%',
        },
      },
      37: {
        indicator: {
          width: '37%',
        },
      },
      38: {
        indicator: {
          width: '38%',
        },
      },
      39: {
        indicator: {
          width: '39%',
        },
      },
      40: {
        indicator: {
          width: '40%',
        },
      },
      41: {
        indicator: {
          width: '41%',
        },
      },
      42: {
        indicator: {
          width: '42%',
        },
      },
      43: {
        indicator: {
          width: '43%',
        },
      },
      44: {
        indicator: {
          width: '44%',
        },
      },
      45: {
        indicator: {
          width: '45%',
        },
      },
      46: {
        indicator: {
          width: '46%',
        },
      },
      47: {
        indicator: {
          width: '47%',
        },
      },
      48: {
        indicator: {
          width: '48%',
        },
      },
      49: {
        indicator: {
          width: '49%',
        },
      },
      50: {
        indicator: {
          width: '50%',
        },
      },
      51: {
        indicator: {
          width: '51%',
        },
      },
      52: {
        indicator: {
          width: '52%',
        },
      },
      53: {
        indicator: {
          width: '53%',
        },
      },
      54: {
        indicator: {
          width: '54%',
        },
      },
      55: {
        indicator: {
          width: '55%',
        },
      },
      56: {
        indicator: {
          width: '56%',
        },
      },
      57: {
        indicator: {
          width: '57%',
        },
      },
      58: {
        indicator: {
          width: '58%',
        },
      },
      59: {
        indicator: {
          width: '59%',
        },
      },
      60: {
        indicator: {
          width: '60%',
        },
      },
      61: {
        indicator: {
          width: '61%',
        },
      },
      62: {
        indicator: {
          width: '62%',
        },
      },
      63: {
        indicator: {
          width: '63%',
        },
      },
      64: {
        indicator: {
          width: '64%',
        },
      },
      65: {
        indicator: {
          width: '65%',
        },
      },
      66: {
        indicator: {
          width: '66%',
        },
      },
      67: {
        indicator: {
          width: '67%',
        },
      },
      68: {
        indicator: {
          width: '68%',
        },
      },
      69: {
        indicator: {
          width: '69%',
        },
      },
      70: {
        indicator: {
          width: '70%',
        },
      },
      71: {
        indicator: {
          width: '71%',
        },
      },
      72: {
        indicator: {
          width: '72%',
        },
      },
      73: {
        indicator: {
          width: '73%',
        },
      },
      74: {
        indicator: {
          width: '74%',
        },
      },
      75: {
        indicator: {
          width: '75%',
        },
      },
      76: {
        indicator: {
          width: '76%',
        },
      },
      77: {
        indicator: {
          width: '77%',
        },
      },
      78: {
        indicator: {
          width: '78%',
        },
      },
      79: {
        indicator: {
          width: '79%',
        },
      },
      80: {
        indicator: {
          width: '80%',
        },
      },
      81: {
        indicator: {
          width: '81%',
        },
      },
      82: {
        indicator: {
          width: '82%',
        },
      },
      83: {
        indicator: {
          width: '83%',
        },
      },
      84: {
        indicator: {
          width: '84%',
        },
      },
      85: {
        indicator: {
          width: '85%',
        },
      },
      86: {
        indicator: {
          width: '86%',
        },
      },
      87: {
        indicator: {
          width: '87%',
        },
      },
      88: {
        indicator: {
          width: '88%',
        },
      },
      89: {
        indicator: {
          width: '89%',
        },
      },
      90: {
        indicator: {
          width: '90%',
        },
      },
      91: {
        indicator: {
          width: '91%',
        },
      },
      92: {
        indicator: {
          width: '92%',
        },
      },
      93: {
        indicator: {
          width: '93%',
        },
      },
      94: {
        indicator: {
          width: '94%',
        },
      },
      95: {
        indicator: {
          width: '95%',
        },
      },
      96: {
        indicator: {
          width: '96%',
        },
      },
      97: {
        indicator: {
          width: '97%',
        },
      },
      98: {
        indicator: {
          width: '98%',
        },
      },
      99: {
        indicator: {
          width: '99%',
        },
      },
      100: {
        indicator: {
          width: '100%',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})
