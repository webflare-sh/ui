<script setup lang="ts">
import { computed, provide } from 'vue'
import { Primitive } from 'reka-ui'
import { cardBorderSizes, cardStyles, type CardBorderSize } from './styles'
import { withCss } from '../../internal/css'
import CardHeader, { type CardHeaderProps } from './CardHeader.vue'
import { CardStylesKey, type CardRootCss } from './types'

export interface Props {
  as?: 'div' | 'li'
  colorStrategy?: 'default' | 'image'
  color?:
    | 'default'
    | 'primary'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info'
    | 'none'
    | 'lucid-deep'
  /** Border width in px, `0`–`8`. Other values snap to `1`. */
  borderSize?: number
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl'
  header?: CardHeaderProps
  css?: CardRootCss
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  colorStrategy: 'default',
  color: 'default',
  borderRadius: 'md',
  borderSize: 1,
})

function resolveBorderSize(value: number): CardBorderSize {
  const rounded = Math.round(value)
  return (cardBorderSizes as readonly number[]).includes(rounded) ? rounded as CardBorderSize : 1
}

const styles = computed(() => cardStyles.raw({
  borderRadius: props.borderRadius,
  borderSize: resolveBorderSize(props.borderSize),
  colorStrategy: props.colorStrategy,
  color: props.color,
}))

provide(CardStylesKey, styles)
</script>

<template>
  <Primitive
    :as="props.as"
    :class="withCss(styles.root, props.css?.root)"
  >
    <slot name="before" />
    <slot name="header">
      <CardHeader
        v-if="props.header"
        v-bind="props.header"
      />
    </slot>
    <slot />
    <slot name="footer" />
    <slot name="after" />
  </Primitive>
</template>
