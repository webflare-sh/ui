<template>
  <ShowcaseContainer>
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Dialog
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'grey.300', _light: { color: 'grey.700' } })">
        Modal dialog built on reka-ui Dialog primitives.
      </p>

      <WfButton
        label="Open dialog"
        color="primary"
        @click="open = true"
      />

      <WfDialogRoot
        v-model:open="open"
        title="Example dialog"
        description="This is a sample description for the dialog."
        close-label="Close"
      >
        <p :class="css({ color: 'grey.300', _light: { color: 'grey.700' } })">
          Dialog body content goes here. Forms, text, or any slot content.
        </p>
        <div :class="css({ marginTop: 'lg' })">
          <WfButton
            label="Done"
            color="primary"
            @click="open = false"
          />
        </div>
      </WfDialogRoot>
    </div>
  </ShowcaseContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { css } from 'styled-system/css'

const open = ref(false)
</script>
