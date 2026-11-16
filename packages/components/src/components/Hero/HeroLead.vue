<script setup lang="ts">
import { computed } from 'vue'
import { heroLeadStyles } from './styles'
import { withCss, type CssMap } from '../../internal/css'
import NativeTag from '../../internal/NativeTag'

export type HeroLeadCss = CssMap<'root' | 'headline' | 'description'>

export interface Props {
  headline?: string
  headlineTag?: string
  description?: string
  alignItems?: 'start' | 'center' | 'end'
  alignSelf?: 'start' | 'center' | 'end'
  size?: 'sm' | 'md' | 'lg'
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  css?: HeroLeadCss
}

const props = withDefaults(defineProps<Props>(), {
  headlineTag: 'h1',
  alignItems: 'start',
  alignSelf: 'start',
  size: 'md',
  gap: 'md',
})

const styles = computed(() => heroLeadStyles.raw({
  alignItems: props.alignItems,
  alignSelf: props.alignSelf,
  size: props.size,
  gap: props.gap,
}))
</script>

<template>
  <div :class="withCss(styles.root, props.css?.root)">
    <slot name="prepend" />
    <slot name="headline">
      <NativeTag
        v-if="headline"
        :as="headlineTag"
        :class="withCss(styles.headline, props.css?.headline)"
      >
        <span
          v-html="headline"
        />
      </NativeTag>
    </slot>
    <slot name="description">
      <div
        v-if="description"
        :class="withCss(styles.description, props.css?.description)"
        v-html="description"
      />
    </slot>
    <slot name="actions" />
    <slot name="append" />
  </div>
</template>
