<template>
  <ShowcaseContainer>
    <!-- Basic Progress -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Basic Progress
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Determinate progress values from 0 to 100.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg', maxWidth: '480px' })">
        <WfProgressRoot :model-value="0" />
        <WfProgressRoot :model-value="25" />
        <WfProgressRoot :model-value="50" />
        <WfProgressRoot :model-value="75" />
        <WfProgressRoot :model-value="100" />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Sizes
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Three size variants: sm, md (default), and lg.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg', maxWidth: '480px' })">
        <div>
          <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' }, marginBottom: 'xs', display: 'block' })">
            sm
          </span>
          <WfProgressRoot
            :model-value="60"
            size="sm"
          />
        </div>
        <div>
          <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' }, marginBottom: 'xs', display: 'block' })">
            md
          </span>
          <WfProgressRoot
            :model-value="60"
            size="md"
          />
        </div>
        <div>
          <span :class="css({ fontSize: 'xs', color: 'grey.300', _light: { color: 'grey.700' }, marginBottom: 'xs', display: 'block' })">
            lg
          </span>
          <WfProgressRoot
            :model-value="60"
            size="lg"
          />
        </div>
      </div>
    </div>

    <!-- Colors -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Colors
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Color variants: primary, success, danger, and info.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg', maxWidth: '480px' })">
        <WfProgressRoot
          :model-value="70"
          color="primary"
          show-value
        />
        <WfProgressRoot
          :model-value="70"
          color="success"
          show-value
        />
        <WfProgressRoot
          :model-value="70"
          color="danger"
          show-value
        />
        <WfProgressRoot
          :model-value="70"
          color="info"
          show-value
        />
      </div>
    </div>

    <!-- Show Value -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Value Label
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Use show-value for a percentage label, or the value slot for custom text.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg', maxWidth: '480px' })">
        <WfProgressRoot
          :model-value="42"
          show-value
        />
        <WfProgressRoot
          :model-value="3"
          :max="10"
          show-value
        >
          <template #value="{ modelValue, max, percentage }">
            {{ modelValue }} / {{ max }} ({{ percentage }}%)
          </template>
        </WfProgressRoot>
      </div>
    </div>

    <!-- Indeterminate -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Indeterminate
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Pass null or omit model-value for an animated indeterminate bar.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'lg', maxWidth: '480px' })">
        <WfProgressRoot :model-value="null" />
        <WfProgressRoot
          :model-value="null"
          color="success"
          size="lg"
        />
        <WfProgressRoot
          :model-value="null"
          color="info"
          size="sm"
        />
      </div>
    </div>

    <!-- Interactive -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Interactive
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Drive progress with a range input.
      </p>

      <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'md', maxWidth: '480px' })">
        <WfProgressRoot
          :model-value="interactiveValue"
          color="primary"
          size="lg"
          show-value
        />
        <input
          v-model.number="interactiveValue"
          type="range"
          min="0"
          max="100"
          :class="css({ width: '100%', accentColor: 'token(colors.primary)' })"
        >
      </div>
    </div>
  </ShowcaseContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css } from 'styled-system/css'

const interactiveValue = ref(45)
</script>
