<template>
  <ShowcaseContainer>
    <!-- Colors -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Colors
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
        Color variants: default, primary, success, info, and danger.
      </p>

      <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
        <WfBadgeRoot label="Default" color="default" />
        <WfBadgeRoot label="Primary" color="primary" />
        <WfBadgeRoot label="Success" color="success" />
        <WfBadgeRoot label="Info" color="info" />
        <WfBadgeRoot label="Danger" color="danger" />
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        Sizes
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
        Three size variants: sm, md (default), and lg.
      </p>

      <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
        <WfBadgeRoot label="Small" size="sm" color="primary" />
        <WfBadgeRoot label="Medium" size="md" color="primary" />
        <WfBadgeRoot label="Large" size="lg" color="primary" />
      </div>
    </div>

    <!-- With icon -->
    <div>
      <h2 :class="css({ fontSize: '2xl', fontWeight: 'bold', marginBottom: 'md' })">
        With icon
      </h2>
      <p :class="css({ marginBottom: 'lg', color: 'text.muted' })">
        Use the icon slot to prepend an Iconify icon.
      </p>

      <div :class="css({ display: 'flex', gap: 'md', flexWrap: 'wrap', alignItems: 'center' })">
        <WfBadgeRoot label="Info" color="info">
          <template #icon>
            <span class="icon icon-info-bold" />
          </template>
        </WfBadgeRoot>
        <WfBadgeRoot label="Success" color="success">
          <template #icon>
            <span class="icon icon-check-bold" />
          </template>
        </WfBadgeRoot>
        <WfBadgeRoot label="Danger" color="danger">
          <template #icon>
            <span class="icon icon-x-bold" />
          </template>
        </WfBadgeRoot>
      </div>
    </div>
  </ShowcaseContainer>
</template>

<script setup lang="ts">
import { css } from 'styled-system/css'
</script>
