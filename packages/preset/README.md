# Internal: Panda CSS preset

Workspace package used to build the preset that `@webflare/ui/design-preset` and `@webflare/ui/preset` export.

This folder is **not** published to npm. Consume the design system as `@webflare/ui`.

Apps that render `@webflare/ui` Vue components should set `designSystem` only:

```ts
import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  designSystem: '@webflare/ui',
  include: [
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  outdir: 'styled-system',
})
```

`@webflare/ui/design-preset` remains for token-only consumers that do **not** use `designSystem`. Do not combine the two.

Font tokens: `fonts.sans` (Figtree, then the system sans), `fonts.serif`, `fonts.mono`, and semantic `fonts.body`. Load the Figtree face in the app. See the [root README](../../README.md#fonts).

The preset imports `@pandacss/preset-base` as a module. `@webflare/ui` depends on that package and `panda lib` inlines it, so a `designSystem: '@webflare/ui'` app does not list it. Token-only configs can pass `presets: [preset]` and get the base preset from that import. A string `'@pandacss/preset-base'` in an app config is still resolved from the app.

See the [root README](../../README.md) for install and publishing.

Apps still on Panda CSS 1.x, or still wiring the preset or `panda.buildinfo.json` by hand: follow the [Panda 2 migration skill](../../.agents/skills/panda-v2-migration/SKILL.md).
