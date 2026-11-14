import { describe, expect, it } from 'vitest'
import { loaderStyles } from '../src/components/Loader/styles'

describe('Loader', () => {
  // A mode condition on `borderColor` writes the `border-color` shorthand
  // again for dark mode, and that rule wins over `border-top-color`. The track
  // must stay one mode-dependent token so the brand arc shows in both modes.
  it('uses one token for the track so the brand arc survives dark mode', () => {
    const styles = loaderStyles.raw({ size: 24 })
    expect(styles.borderColor).toBe('loader.track')
    expect(styles.borderTopColor).toBe('primary')
  })
})
