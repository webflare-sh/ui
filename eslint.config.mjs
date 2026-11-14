// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import unusedImports from 'eslint-plugin-unused-imports'
import webflare from './scripts/eslint/no-mode-block.mjs'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './packages/components/src',
      './packages/nuxt/src',
      './packages/preset/src',
    ],
  },
})
  .append({
    ignores: [
      '**/styled-system/**',
      '**/dist/**',
      '**/*.d.ts',
      'packages/components/src/vue/**',
      'packages/nuxt/test/fixtures/**',
    ],
  })
  .append({
    plugins: {
      'unused-imports': unusedImports,
      webflare,
    },
    rules: {
      // One key per property with the mode inside it, so `css` overrides
      // replace dark values too (see scripts/eslint/no-mode-block.mjs).
      'webflare/no-mode-block': 'error',
      // Content props render as HTML on purpose. Sanitizing untrusted strings
      // is the consuming app's job (see README "Text and HTML content").
      'vue/no-v-html': 'off',
      '@stylistic/no-trailing-spaces': 'off',
      // Disable base rules that conflict with unused-imports plugin
      '@typescript-eslint/no-unused-vars': 'off',
      // Enable unused imports detection and auto-fix
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  })
