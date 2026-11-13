<script setup lang="ts">
/**
 * @component Button
 * @description Renders a `<button>`, or an `<a>` when `to` is set.
 *
 * @prop {string|null} label - Button text, rendered as HTML. Sanitize untrusted strings before passing them.
 * @prop {string|null} [icon] - Icon name, rendered as `icon icon-<name>`.
 * @prop {string|null} [to] - Renders an anchor with this `href`.
 * @prop {'button'|'submit'|'reset'|null} [type] - Button type. Defaults to `button`. Ignored for links.
 * @prop {'secondary'|'primary'|'transparent'} [color='secondary'] - Color scheme.
 * @prop {'sm'|'md'|'lg'} [size='md'] - Size.
 * @prop {'regular'|'inverse'} [order='regular'] - Icon before or after the label.
 * @prop {boolean} [fullWidth=false] - Stretch to the container width.
 * @prop {boolean} [external=false] - For links: open in a new tab with `rel="noopener noreferrer"`.
 * @prop {boolean} [disabled=false] - Disable the button. A disabled link loses its `href` and gets `aria-disabled`.
 * @prop {ButtonCss} [css] - Style overrides (`root`). Wrap values in `css.raw()`.
 *
 * @example
 * <Button label="Click me" />
 * <Button label="Visit Site" to="https://example.com" external />
 * <Button color="primary" size="lg" label="Large Primary Button" />
 */
import { computed } from 'vue'
import { buttonStyles } from './styles'
import { withCss, type CssMap } from '../../internal/css'

export type ButtonCss = CssMap<'root'>

defineOptions({ name: 'WfButton' })

const props = withDefaults(defineProps<{
  label?: string | null
  icon?: string | null
  to?: string | null
  type?: 'button' | 'submit' | 'reset' | null
  color?: 'secondary' | 'primary' | 'transparent'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  order?: 'regular' | 'inverse'
  external?: boolean
  disabled?: boolean
  css?: ButtonCss
}>(), {
  label: null,
  icon: null,
  to: null,
  type: null,
  color: 'secondary',
  size: 'md',
  order: 'regular',
})

const isLink = computed(() => Boolean(props.to))

/** `title` is an attribute, so an HTML label is reduced to its text. */
const title = computed(() => props.label ? props.label.replace(/<[^>]*>/g, '').trim() : undefined)

const attrs = computed(() => {
  if (!isLink.value) {
    return {
      type: props.type ?? 'button',
      disabled: props.disabled || undefined,
    }
  }
  if (props.disabled) {
    // A link cannot be disabled natively: drop `href` so it does not navigate
    // or take focus, and expose the state to assistive tech.
    return { 'role': 'link', 'aria-disabled': 'true' }
  }
  return {
    href: props.to,
    target: props.external ? '_blank' : undefined,
    rel: props.external ? 'noopener noreferrer' : undefined,
  }
})

const buttonClass = computed(() => withCss(
  buttonStyles.raw({
    color: props.color,
    size: props.size,
    order: props.order,
    fullWidth: props.fullWidth,
  }),
  props.css?.root,
))
</script>

<template>
  <component
    :is="isLink ? 'a' : 'button'"
    :class="['btn', buttonClass]"
    :title="title"
    v-bind="attrs"
  >
    <span
      v-if="props.icon"
      :class="[
        'btn-icon',
        'icon',
        `icon-${props.icon}`,
      ]"
      aria-hidden="true"
    />

    <span
      v-if="props.label"
      class="btn-label"
      v-html="props.label"
    />
  </component>
</template>
