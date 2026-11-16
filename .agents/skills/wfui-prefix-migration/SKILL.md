---
name: wfui-prefix-migration
description: >-
  Update a Vue app that installs the @webflare/ui plugin with app.use(WfUI)
  for the release where WfUI registers its components with the Wf prefix
  (WfButton, WfCardRoot, WfFieldInput, …) instead of the bare export names.
  Use when the app's templates use bare tags such as <Button>, <CardRoot>, or
  <FieldInput> that come from WfUI's global registration; when the app
  registers the components by hand with a Wf prefix to work around the
  WfButton recursion / SSR hang (issue #24); or when components stop resolving
  after an @webflare/ui upgrade. Not needed for the Nuxt module
  (@webflare/ui/nuxt), which already used the Wf prefix.
---

# Migrate a Vue app to the prefixed WfUI plugin

Up to 0.1.1, `app.use(WfUI)` registered every component under its bare export name (`Button`, `CardRoot`, …). `Button` renders `<component :is="'button'">`, and Vue resolves the string `'button'` against the global registry, so it found its own `Button` and rendered itself forever: a stack overflow, or a hang in SSR.

Now `WfUI` registers `Wf`-prefixed names by default, the same as the Nuxt module and the README, and takes a `prefix` option. Library components render native tags directly, so no registered component can replace them.

## Find the app's setup

| The app … | Do this |
| --- | --- |
| uses the Nuxt module (`modules: ['@webflare/ui/nuxt']`) | Nothing. The module already registered `Wf*` names. |
| imports components locally (`import { Button } from '@webflare/ui'`) | Nothing. Local imports are unaffected. |
| calls `app.use(WfUI)` and writes bare tags (`<CardRoot>`) | [Rename the tags](#rename-the-tags), or [keep the bare names](#keep-the-bare-names) |
| registers components by hand with a `Wf` prefix as a workaround | [Remove the workaround](#remove-the-workaround) |

## Rename the tags

Prefix every component tag that comes from the plugin with `Wf`, including closing tags:

```diff
- <CardRoot>
-   <CardHeader title="Plan" />
-   <Button label="Buy" />
- </CardRoot>
+ <WfCardRoot>
+   <WfCardHeader title="Plan" />
+   <WfButton label="Buy" />
+ </WfCardRoot>
```

Kebab-case works too: `<wf-card-root>`. Search the templates for every name exported from `@webflare/ui` (`AccordionRoot`, `AlertRoot`, `BadgeRoot`, `Button`, `Card*`, `Carousel*`, `DialogRoot`, `Field*`, `Flyout*`, `FormPrompt*`, `HeroLead`, `List*`, `Loader`, `PricingCard*`, `ProgressRoot`, `SwitchRoot`, `TabRoot`, `TabItem`). Leave locally imported components alone.

## Keep the bare names

If renaming isn't practical, keep the old names with an empty prefix:

```ts
app.use(WfUI, { prefix: '' })
```

This is now safe: `Button` no longer resolves its own tag through the registry. Any other prefix also works (`{ prefix: 'Acme' }` registers `AcmeButton`, …).

## Remove the workaround

Delete the loop that registered the components by hand, for example:

```diff
- import { Button, CardRoot, CardBody } from '@webflare/ui'
- const components = { Button, CardRoot, CardBody }
- for (const [name, component] of Object.entries(components)) {
-   app.component(`Wf${name}`, component)
- }
+ import WfUI from '@webflare/ui'
+ app.use(WfUI)
```

The templates keep their `Wf*` tags.

## Verify

- Render a page with `<WfButton>` through the app's SSR path (`renderToString`, or a prerender build). It finishes and outputs a native `<button class="btn …">`.
- In dev, the console shows no `Failed to resolve component: Wf…` or `Failed to resolve component: CardRoot` warnings.
