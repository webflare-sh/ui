<script setup lang="ts">
import { inject, computed } from 'vue'
import { pricingCardStyles } from './styles'
import { withCss } from '../../internal/css'
import NativeTag from '../../internal/NativeTag'
import { PricingCardStylesKey, PricingCardDataKey, type PricingCardData, type PricingCardHeaderCss } from './types'

export interface PricingCardHeaderProps {
  title?: string
  titleTag?: string
  subtitle?: string
  css?: PricingCardHeaderCss
}

const props = defineProps<PricingCardHeaderProps>()

const styles = inject(
  PricingCardStylesKey,
  computed(() => pricingCardStyles.raw()),
)

const data = inject(
  PricingCardDataKey,
  computed<PricingCardData>(() => ({})),
)

const titleTag = computed(() => props.titleTag ?? data.value.titleTag ?? 'div')
const title = computed(() => props.title ?? data.value.title)
const subtitle = computed(() => props.subtitle ?? data.value.subtitle)
</script>

<template>
  <header :class="withCss(styles.header, props.css?.root)">
    <slot name="prepend" />
    <slot>
      <div :class="withCss(styles.headerPackage, props.css?.headerPackage)">
        <slot name="title">
          <NativeTag
            v-if="title"
            :as="titleTag"
            :class="withCss(styles.title, props.css?.title)"
          >
            {{ title }}
          </NativeTag>
        </slot>
        <slot name="subtitle">
          <p
            v-if="subtitle"
            :class="withCss(styles.subtitle, props.css?.subtitle)"
          >
            {{ subtitle }}
          </p>
        </slot>
      </div>
    </slot>
    <slot name="append" />
  </header>
</template>
