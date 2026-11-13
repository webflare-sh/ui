<template>
  <ShowcaseContainer>
    <!-- Basic PricingCard -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Basic PricingCard
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Default pricing card with data provided through the Root component.
      </p>

      <WfPricingCardRoot
        title="Starter"
        subtitle="For new Onlineshops"
        price="$999"
        :features="features"
      >
        <WfPricingCardHeader />
        <WfPricingCardPricing />
        <WfPricingCardBody />
      </WfPricingCardRoot>
    </div>

    <!-- Highlighted PricingCard -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Highlighted PricingCard
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Highlighted pricing card using the primary brand token for the border.
      </p>

      <WfPricingCardRoot
        title="Starter"
        subtitle="For new Onlineshops"
        price="$999"
        :features="features"
        highlight
      >
        <WfPricingCardBadge label="Featured" />
        <WfPricingCardHeader />
        <WfPricingCardPricing />
        <WfPricingCardBody />
      </WfPricingCardRoot>
    </div>

    <!-- PricingCard with prop override -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        PricingCard with prop override
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Child component props take precedence over injected data.
      </p>

      <WfPricingCardRoot
        title="Starter"
        subtitle="For new Onlineshops"
        price="$999"
        :features="features"
      >
        <WfPricingCardHeader />
        <WfPricingCardPricing price="$899" />
        <WfPricingCardBody />
      </WfPricingCardRoot>
    </div>

    <!-- PricingCard with per-component css map overrides -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Per-component css map overrides
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Each component accepts a <code>css</code> prop keyed by slot name. The outermost element is always <code>root</code>. Wrap each value in <code>css.raw()</code> so Panda generates the CSS.
      </p>

      <WfPricingCardRoot
        title="Pro"
        subtitle="For growing shops"
        price="$1,499"
        :features="features"
        :css="{ root: css.raw({ maxWidth: '420px', borderRadius: 'lg', boxShadow: '0 10px 30px {colors.grey.900}' }) }"
      >
        <WfPricingCardBadge label="Best Value" :css="{ root: css.raw({ bg: 'success', fontSize: 'xs', paddingInline: 'lg' }) }" />
        <WfPricingCardHeader :css="{ root: css.raw({ padding: 'xl' }), headerPackage: css.raw({ gap: 'xs' }), title: css.raw({ fontSize: '2xl' }) }" />
        <WfPricingCardPricing :css="{ root: css.raw({ paddingInline: 'xl', marginBottom: 'md' }), price: css.raw({ color: 'primary', fontSize: '3xl' }) }" />
        <WfPricingCardBody :css="{ root: css.raw({ paddingBlock: 'xl', paddingInline: 'xl' }), feature: css.raw({ fontSize: 'sm' }), featureIcon: css.raw({ color: 'success' }) }" />
      </WfPricingCardRoot>
    </div>
  </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css'

const features = [
  'Production ready in 14 days',
  'Shopware Installation',
  'Theme Setup',
  '1 Saleschannel Setup',
]
</script>
