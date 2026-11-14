import { defineTokens } from '@pandacss/dev'

/**
 * `sizes.container` is a width token (`maxW: 'container'`). It is unrelated to
 * the `container` pattern and to the `containers` scale for container queries.
 */
export const sizes = defineTokens.sizes({
  container: { value: '1200px' },
  prose: { value: '44rem' },
})
