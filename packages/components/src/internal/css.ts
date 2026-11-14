import { css } from 'styled-system/css'
import type { SystemStyleObject } from 'styled-system/types'

/**
 * Per-component `css` prop: style objects keyed by the component's slot names.
 * `root` is always the outermost element.
 *
 * Panda only generates CSS for objects it can see at build time, so pass each
 * slot through `css.raw()` from the app's own `styled-system/css`:
 *
 * ```vue
 * <WfAlertRoot :css="{ root: css.raw({ maxWidth: 'md' }) }" />
 * ```
 */
export type CssMap<K extends string> = Partial<Record<K, SystemStyleObject>>

/**
 * Class for one slot: the component's style object merged with the consumer's
 * override.
 *
 * Component styles are atomic classes, so appending an override class would
 * leave both `bg_x` and `bg_y` on the element and let stylesheet order decide.
 * Merging the objects first gives one class per property, and the override wins.
 *
 * Pass `styles.raw(…)` (or a slot of it), not the class string from `styles(…)`.
 */
export function withCss(style: SystemStyleObject | undefined, override?: SystemStyleObject | null): string {
  return css(style, override ?? undefined)
}
