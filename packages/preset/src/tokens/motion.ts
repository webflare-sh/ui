import { defineTokens } from '@pandacss/dev'

export const durations = defineTokens.durations({
  fast: { value: '150ms' },
  normal: { value: '300ms' },
  slow: { value: '600ms' },
})

export const easings = defineTokens.easings({
  default: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  out: { value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
})
