<template>
    <div 
        :class="cx(
            grid({
                gap: '0',
                columns: { base: 1, lg: 2 },
                alignItems: 'start',
                minHeight: '100vh',
                width: '100vw',
            })
        )">

        <div 
            v-for="theme in ['light', 'dark']" 
            :key="theme"
            :class="[{ dark: theme === 'dark' },
                css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { base: '2xl', xl: '4xl' },
                    backgroundColor: 'surface',
                    color: 'neutral',
                    padding: { base: '2xl', xl: '4xl' },
                    minHeight: '100%',
                    height: 'fit-content',
                })
            ]">
            
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { grid } from 'styled-system/patterns';
import { css, cx } from 'styled-system/css';
</script>