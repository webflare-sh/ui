# Changelog

## 0.2.0

[compare changes](https://github.com/webflare-sh/ui/compare/0.1.1...0.2.0)

### 🚀 Enhancements

- ⚠️  Replace the WfUI plugin with an auto-import resolver ([#25](https://github.com/webflare-sh/ui/pull/25), fixes [#24](https://github.com/webflare-sh/ui/issues/24))

#### ⚠️ Breaking Changes

- ⚠️  Replace the WfUI plugin with an auto-import resolver ([#25](https://github.com/webflare-sh/ui/pull/25))

  `WfUI` (`app.use(WfUI)`) and the default export of `@webflare/ui` are removed; the package registers nothing globally. Vue apps add `Components({ resolvers: [WebflareResolver()] })` from `unplugin-vue-components` with `@webflare/ui/resolver` to keep `Wf*` tags, or import the components they use. Nuxt apps are not affected. See the README's Vue section and the [migration guide](https://github.com/webflare-sh/ui/blob/master/.agents/skills/wfui-plugin-removal/SKILL.md).

### ❤️ Contributors

- Claude <noreply@anthropic.com>

## 0.1.1

[compare changes](https://github.com/webflare-sh/ui/compare/0.1.0...0.1.1)

### 🩹 Fixes

- Use release tags without a v prefix ([7e05eb7](https://github.com/webflare-sh/ui/commit/7e05eb7))
- Accept TypeScript 6 as the optional typescript peer ([#22](https://github.com/webflare-sh/ui/pull/22))

### ❤️ Contributors

- Claude <noreply@anthropic.com>
- ROBJkE <robert@fyrst.digital>

## 0.1.0

First release of `@webflare/ui`, the Webflare design system.

- Vue 3 components built on Reka UI: Accordion, Alert, Badge, Button, Card, Carousel, Dialog, Field, Flyout, Form, Hero, List, Loader, PricingCard, Progress, Switch, and Tab. Every component takes a `css` prop for per-slot style overrides.
- Webflare colors: a coral `brand` ramp (50–900), `primary` in the brand color, and the roles `primary-pale`, `neutral`, `surface`, `surface-muted`, `border`, `muted`, `text.muted`, `text.placeholder`, `loader.track`, `input-*`, and `accent-*`, plus the `danger` / `success` / `warning` / `info` status colors.
- Light is the default color mode. Dark applies on and inside an element with the `.dark` class, and when the OS prefers dark.
- Design tokens for spacing, radii, font sizes, font weights, line heights, letter spacings, sizes, durations, easings, and shadows (focus rings, `card`, `float`).
- Panda CSS design system. Apps set `designSystem: '@webflare/ui'` and get the theme and every component style. Token-only apps can use `@webflare/ui/design-preset`.
- Nuxt module at `@webflare/ui/nuxt` (config key `wfUi`). It auto-imports the components with the `Wf` prefix (`WfButton`, `WfCardRoot`, …). Vue apps use the `WfUI` plugin.
- Phosphor icons as single-color CSS masks in `@webflare/ui/style.css`, with 35 `.icon-*` classes.
- Figtree font stack. The package ships no font files.
