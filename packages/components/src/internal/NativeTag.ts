import { defineComponent, h } from 'vue'

/**
 * Renders the HTML element named by `as`.
 *
 * Use it instead of `<component :is="'button'">` for native tags. A string
 * `:is` goes through `resolveDynamicComponent`, which checks the app's global
 * components first: `'button'` would pick up a component registered as
 * `Button` (the app's own, or ours under `app.use(WfUI, { prefix: '' })`),
 * and a Button that resolves to itself never stops rendering. `h()` with a
 * string always creates the element.
 */
export default defineComponent({
  name: 'WfNativeTag',
  inheritAttrs: false,
  props: {
    as: { type: String, required: true },
  },
  setup(props, { attrs, slots }) {
    return () => h(props.as, attrs, slots.default?.())
  },
})
