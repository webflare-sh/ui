---
name: wfui-plugin-removal
description: >-
  Update a Vue app for the @webflare/ui release that removed the WfUI plugin
  (`import WfUI from '@webflare/ui'`, `app.use(WfUI)`) and the package's
  default export. Use when the app imports WfUI or the default export of
  @webflare/ui; when the build fails with "WfUI is not exported" or "does not
  provide an export named 'default'"; when <WfButton>, <CardRoot>, or other
  Webflare tags stop resolving ("Failed to resolve component") after an
  upgrade; or when the app registers the components with a Wf prefix by hand
  to work around the WfButton recursion / SSR hang (issue #24). Not needed
  for the Nuxt module (@webflare/ui/nuxt), which is unchanged.
---

# Migrate a Vue app off the WfUI plugin

Up to 0.1.1, `app.use(WfUI)` registered every component globally under its bare export name (`Button`, `CardRoot`, …). `Button` rendered `<component :is="'button'">`, which Vue resolves against the global components first, so it found its own `Button` and rendered itself forever: a stack overflow, or a hang in SSR (issue #24).

`@webflare/ui` now registers nothing globally, like Reka UI. `WfUI` and the default export are gone. Components that pick their tag at runtime render it with Reka's `Primitive`, so no global component can replace their native element.

## Find the app's setup

| The app … | Do this |
| --- | --- |
| uses the Nuxt module (`modules: ['@webflare/ui/nuxt']`) | Nothing. The module still auto-imports `Wf*` tags. |
| imports components locally (`import { Button } from '@webflare/ui'`) | Nothing. |
| calls `app.use(WfUI)` | Remove it, then pick [the resolver](#use-the-resolver), [local imports](#import-locally), or [explicit registration](#register-explicitly) |
| registers components by hand with a `Wf` prefix as a workaround | [Use the resolver](#use-the-resolver) and delete the registration loop |

Start with `main.ts`:

```diff
  import { createApp } from 'vue'
- import WfUI from '@webflare/ui'
  import '@webflare/ui/style.css'

  const app = createApp(App)
- app.use(WfUI)
```

## Use the resolver

Recommended for apps that use many components. Templates keep `Wf*` tags, the same as Nuxt, and each tag compiles to a named import, so nothing is global and unused components are tree-shaken.

```bash
bun add -d unplugin-vue-components
```

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import WebflareResolver from '@webflare/ui/resolver'

export default defineConfig({
  plugins: [vue(), Components({ resolvers: [WebflareResolver()] })],
})
```

- Templates already on `<WfButton>`, `<WfCardRoot>` (for example after the hand-written workaround) work as they are.
- Templates on bare tags (`<CardRoot>`) can either be renamed to `Wf*` (preferred, it matches the Nuxt docs and README) or keep their names with `WebflareResolver({ prefix: '' })`.
- If the app sets `dts: true`, commit or regenerate `components.d.ts` so `vue-tsc` sees the tags.

## Import locally

For apps that use a few components:

```vue
<script setup lang="ts">
import { Button, CardRoot } from '@webflare/ui'
</script>

<template>
  <CardRoot>
    <Button label="Buy" />
  </CardRoot>
</template>
```

Rename `Wf*` tags to the imported names, or import with an alias (`import { Button as WfButton } from '@webflare/ui'`).

## Register explicitly

If the app really needs a component global (for example for content rendered from strings), register it under a `Wf` name:

```ts
import { Button, CardRoot } from '@webflare/ui'

app.component('WfButton', Button)
app.component('WfCardRoot', CardRoot)
```

This is safe now even under a bare name, because the components no longer resolve their native tag through the registry, but prefer the `Wf` names to avoid clashing with the app's own components.

## Verify

- `grep -rnE "WfUI|import [A-Za-z_$]+ from '@webflare/ui'" src` finds no plugin import or default import.
- `vue-tsc --noEmit` and the production build pass.
- Render a page with a Webflare button through the app's SSR path (`renderToString` or a prerender build). It finishes and outputs a native `<button class="btn …">`.
- The dev console shows no `Failed to resolve component: Wf…` warnings.
