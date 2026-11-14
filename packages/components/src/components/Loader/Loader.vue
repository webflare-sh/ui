<script setup lang="ts">
import { computed } from 'vue'
import { loaderSizeValues, loaderStyles, type LoaderSizeValue } from './styles'
import { withCss, type CssMap } from '../../internal/css'

export type LoaderCss = CssMap<'root'>

defineOptions({ name: 'WfLoader' })

const props = withDefaults(defineProps<{
  /** Diameter in px. Snaps to the closest of 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 120. */
  size?: number
  label?: string
  css?: LoaderCss
}>(), {
  size: 40,
  label: 'Loading',
})

function resolveLoaderSize(value: number): LoaderSizeValue {
  return loaderSizeValues.reduce((best, candidate) =>
    Math.abs(candidate - value) < Math.abs(best - value) ? candidate : best,
  )
}

const loaderClass = computed(() => withCss(
  loaderStyles.raw({ size: resolveLoaderSize(props.size) }),
  props.css?.root,
))
</script>

<template>
  <div
    :class="['loader', loaderClass]"
    role="status"
    :aria-label="label"
  />
</template>
