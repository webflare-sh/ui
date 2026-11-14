# Internal: Nuxt module

Workspace package used to build the Nuxt module that `@webflare/ui/nuxt` exports.

This folder is **not** published to npm. Consume the design system as `@webflare/ui`.

```ts
export default defineNuxtConfig({
  modules: ['@webflare/ui/nuxt'],
  css: ['~/assets/css/global.css'],
  postcss: {
    plugins: {
      '@pandacss/dev/postcss': {},
    },
  },
})
```

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  designSystem: '@webflare/ui',
  include: [
    './app/**/*.{js,ts,vue}',
  ],
  outdir: 'styled-system',
})
```

The module auto-imports Vue components. It does **not** generate Panda CSS. Keep `@layer reset, base, tokens, recipes, utilities` in your CSS. In `dev`, the module warns if `@webflare/ui/panda/lib.json` cannot be resolved or PostCSS is missing `@pandacss/dev/postcss`.

See the [root README](../../README.md) for the full consumer setup.
