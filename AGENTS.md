# Agent Instructions for @webflare/ui

Monorepo for the Webflare design system. Publish **one** npm package: `@webflare/ui`.

Workspace packages (private, not published):
- `@webflare/design-preset` - Panda CSS preset (`@webflare/ui/design-preset`)
- `@webflare/ui-components` - Vue 3 UI components (`@webflare/ui` / `@webflare/ui/components`)
- `@webflare/ui-nuxt` - Nuxt module (`@webflare/ui/nuxt`)

Uses Bun as package manager and build tool, full TypeScript support.

First-party agent skills live in `.agents/skills/<name>/SKILL.md`. A consumer app that is still on Panda CSS 1.x, still lists `panda.buildinfo.json` in `include`, or still adds the preset by hand instead of setting `designSystem: '@webflare/ui'` should follow [`.agents/skills/panda-v2-migration/SKILL.md`](.agents/skills/panda-v2-migration/SKILL.md). Every breaking change to the public API needs a matching section in a migration skill.

## Package Structure

```
packages/
├── preset/              # @webflare/design-preset - Panda CSS Preset
│   └── src/
│       ├── index.ts           # Token preset (`@webflare/ui/design-preset`)
│       └── tokens/            # One file per kind of base token, plus semantic-tokens.ts
│           ├── colors.ts, spacing.ts, radii.ts, sizes.ts, breakpoints.ts
│           ├── typography.ts      # fonts, font sizes and weights, line heights, letter spacings
│           ├── motion.ts          # durations, easings
│           └── semantic-tokens.ts # roles, modes, opacity, shadows
├── components/          # @webflare/ui-components - Vue 3 UI Components
└── nuxt/               # @webflare/ui-nuxt - Nuxt Module
    ├── src/runtime/         # Module runtime
    └── test/             # E2E tests
```

## Build Commands

```bash
bun run build              # Clean root dist, link @webflare/ui, build preset/components/nuxt, assemble dist, panda lib
bun run build:preset        # Panda CSS preset
bun run build:components    # Vue components + root dist exports
bun run build:nuxt          # Nuxt module (prepack only; does not build playground)
bun run panda:lib           # panda codegen + panda lib (manifest under dist/panda/, syncs generated exports)
bun run link:package        # Symlink the root package to node_modules/@webflare/ui (dev only)
bun run watch:preset        # Preset watch mode
bun run dev:components      # Components dev server
bun run dev:nuxt            # Link @webflare/ui, panda lib, then Nuxt module playground
bun run dev:nuxt:prepare    # Link @webflare/ui, panda lib, then stub/prepare the Nuxt module + playground
bun run dev:nuxt:build      # Link @webflare/ui, then build the Nuxt playground (dev check, not publish)
bun run typecheck           # tsc on the preset, vue-tsc on the components
bun run clean               # Clean all dist folders
bun run changelog           # Add the CHANGELOG entry for the package.json version (from the previous v* tag)
```

## Lint Commands

```bash
bun run lint               # ESLint on sources, tests, and build scripts
bun run lint:fix            # Auto-fix lint issues
bun run --filter='@webflare/ui-nuxt' lint   # Lint specific package
```

## Test Commands

`@webflare/ui-components` has Vitest unit/SSR tests. `@webflare/ui-nuxt` has Vitest tests with `@nuxt/test-utils` (needs a prior `bun run build` for dist + `panda lib` artifacts).

```bash
bun run test                              # Link @webflare/ui, then run all tests
bun run --filter='@webflare/ui-components' test   # Component unit + SSR tests
bun run --filter='@webflare/ui-nuxt' test    # Nuxt package tests (needs `bun run link:package`)
bun run --filter='@webflare/ui-nuxt' test:watch   # Watch mode
bun run --filter='@webflare/ui-nuxt' test -- basic.test.ts   # Single file
bun run --filter='@webflare/ui-nuxt' test -t "test name"    # By name
bun run --filter='@webflare/ui-nuxt' test:types             # Type checking
```

`bun run check:colors` runs the color checks (CI runs it after the tests):

- **CSS check** (blocks a merge): generates the CSS with `panda cssgen` into `node_modules/.cache/color-checks/`; every `var(--colors-*)` must be declared and no color property may contain a raw token name such as `brand.pale`.
- **strictTokens** (blocks on color properties): codegen with `packages/components/panda.strict-tokens.config.ts`, then `vue-tsc -p tsconfig.strict-tokens.json`. Findings on other properties are listed, not fixed.
- **Contrast** (warning only): text 4.5:1, borders and focus 3:1, in both modes, measured over the real background. A pair that names an unknown token or a color the check cannot parse is reported as a warning, never an error; `packages/nuxt/test/color-checks.test.ts` still fails on it so a stale pair gets fixed.

## Code Style Guidelines

### TypeScript

- `strict: true` - Enable all strict type checking
- `noImplicitOverride` - Always use `override` keyword for inherited methods
- `noUncheckedIndexedAccess` - Array indices return `T | undefined`
- `verbatimModuleSyntax` - Use `import type` explicitly for type-only imports
- `moduleResolution: bundler` - Modern import behavior
- `noUnusedLocals: true`, `noUnusedParameters: true`

**Path Aliases:**
```json
{
  "@webflare/ui/*": "./packages/*/src/index.ts",
  "@webflare/design-preset": "./packages/preset/src/index.ts",
  "@webflare/ui-components": "./packages/components/src/index.ts"
}
```

### Import Conventions

- Use type-only imports for types: `import type { Foo } from '...'`
- ESLint errors on unused imports - remove them or prefix with `_`
- Group imports: external packages, then workspace packages
- Example:
  ```typescript
  import type { Component } from 'vue'
  import { useSlots } from 'vue'
  import type { ButtonProps } from '@webflare/ui-components'
  ```

### Naming

- PascalCase for components, types, interfaces, enums
- camelCase for variables, functions, file names (except Vue components)
- Prefix unused args with `_`: `_event`, `_props`
- Prefix unused imports with `_`: `import type { _UnusedType }`

### Vue Components

- Use `<script setup lang="ts">`
- Use Reka UI for primitives
- Use Panda CSS for styling
- Follow patterns in `packages/components/src/`

### Component Styling (CVA/SVA)

Component styles are `cva` (one element) or `sva` (several slots) definitions in the component's folder. Panda extracts them from the published JS and generates every variant.

**1. Component folder** (e.g. `packages/components/src/components/Badge/`):
```
Badge/
├── BadgeRoot.vue
├── styles.ts
└── index.ts
```
Standalone exceptions (`Button`, `Loader`) keep those public names (not `ButtonRoot` / `LoaderRoot`) but still use a folder + `styles.ts`. Internal controls keep their styles next to them in `src/internal/controls/` (`controlStyles.ts`, `choiceStyles.ts`, …).

**2. styles.ts** — a static object literal. Panda reads it at build time, so do not build variants with loops, spreads of shared constants, or `Object.fromEntries`; write them out.
```typescript
import { sva } from 'styled-system/css'

export const badgeStyles = sva({
  slots: ['root', 'icon'],
  base: { root: { ... } },
  variants: { size: { sm: { root: { ... } } } },
  defaultVariants: { size: 'md' },
})
```

**3. Component** — every component takes a `css` prop typed `CssMap<…>`; `root` is always the outermost element. For each slot that accepts an override, take the style object with `.raw()` and merge the override with `withCss`:
```vue
<script setup lang="ts">
import { computed } from 'vue'
import { withCss, type CssMap } from '../../internal/css'
import { badgeStyles } from './styles'

export type BadgeCss = CssMap<'root' | 'icon'>

const props = defineProps<{ size?: 'sm' | 'md' | 'lg', css?: BadgeCss }>()
const styles = computed(() => badgeStyles.raw({ size: props.size }))
</script>

<template>
  <span :class="withCss(styles.root, props.css?.root)">…</span>
</template>
```

- `withCss(style, override)` is `css(style, override)`: one class per property, the override wins. Never append an override class to a finished class string; both atomic classes would stay on the element and stylesheet order would decide.
- Parts without an override (internal chrome) may call the definition directly: `fieldStyles().footer`.
- Share style objects between parts through a typed `createInjectionKey` context (see `Card/types.ts`), never string keys.
- Calling `.raw()` with runtime variants in another file triggers Panda's `imported_recipe_raw_dynamic` warning. It is expected: the definition itself still generates every variant.
- Color modes: light is the base. Dark applies under `.dark` and when the OS prefers dark, so every dark value is written under both `_dark` and `_osDark` with the same value. The preset's `dark` and `light` conditions (`.dark &, .dark&`, `.light &, .light&`) match the element that carries the class as well as its descendants, like the token block does; keep both selectors.
- Prefer semantic tokens (`surface`, `border`, `text.muted`, `neutral`) over mode conditions. Where a mode condition is needed, put it inside the property (`bg: { base, _dark, _osDark }`), never a `_dark: { … }` / `_osDark: { … }` block: `withCss` merges by key, so a block's dark values survive a consumer's override of the same property and win in dark mode. Inside a state (`_hover`, `&[data-state="checked"]`, …) write the mode conditions too, even when the value is the same in both modes, so the state beats the dark resting color on specificity (see `switchStyles.ts`). The `webflare/no-mode-block` lint rule (`scripts/eslint/no-mode-block.mjs`) reports blocks in linted files. `_dark` and `_osDark` on one object must be the same value, and the rule reports a missing or different twin. `packages/nuxt/test/no-mode-block.test.ts` runs it on the playground as well.
- Use only published colors: the brand / red / green / blue / yellow / grey shades, `white`, `black`, `transparent`, the roles, and the status colors. Use the opacity modifier (`black/10`) for transparency, not raw `rgba()`. Removed tokens and their replacements are listed in `packages/nuxt/test/fixtures/tokens/removed-colors.json`.

**4. Content.** Content props (labels, titles, descriptions, item content, field message / error) render with `v-html`, as documented in the README. Sanitizing untrusted strings is the consuming app's job, not the library's; `vue/no-v-html` is off for that reason. Where practical, offer a slot for the same content so apps can pass escaped text or their own nodes.

**5. index.ts** — named parts plus default namespace `{ Root, … }`, and export the component's `*Css` types:
```typescript
import BadgeRoot from './BadgeRoot.vue'
export { BadgeRoot }
export type { BadgeCss } from './BadgeRoot.vue'
export default { Root: BadgeRoot }
```

Register the entry in `vue-entries.ts` (`vueLibEntries`; `nuxtComponents` is derived) and the named export in `vue-components.ts`. `Button` / `Loader` export the SFC by those names and do not use a `{ Root }` namespace.

Do not export `Control*` from `@webflare/ui`. Bare controls stay under `src/internal/controls/` and share `useFieldControl()` (id, ARIA links, validity from the Field context). Public form API is `Field.*` / `WfField*`; composed fields use `FieldSharedProps` and `FieldFooter`. Re-export `FieldOption` from Field.

### Panda CSS

- Use semantic tokens: `colors.primary`, `colors.neutral`
- Use responsive props: `{ base: ..., md: ..., lg: ... }`
- Mobile-first: define base styles, then add breakpoints
- Breakpoints: `3xs` (360px), `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`

### Error Handling

- Use proper TypeScript types - avoid `any`
- Handle async with proper error types
- Use Vitest with `@nuxt/test-utils`

### ESLint

- Uses `@nuxt/eslint-config` with stylistic rules
- Unused imports = error (fix with `bun run lint:fix`)
- Unused variables = warning (prefix with `_` to silence)
- `@typescript-eslint/no-unused-vars` disabled; uses unused-imports plugin

### Release Process (maintainers)

Publish the root `@webflare/ui` package with `.github/workflows/publish.yml`. The Action authenticates with npm trusted publishing (OIDC) in the `npm-publish` environment. Do not add `NPM_TOKEN` or a bypass-2FA granular token.

Agents never tag, create a GitHub Release, or publish. Each of those needs the maintainer's explicit approval.

`publish.yml` runs on a published GitHub Release and on a manual start. Both must run from the tag `v<version>` that matches `package.json`; the first step fails on a branch or on any other tag. Keep `packages/nuxt/test/consumer-contract.test.ts` in sync with the workflow.

**Changelog.** The `v0.1.0` entry in `CHANGELOG.md` is written by hand. For every later release, bump the version in all four `package.json` files, then run `bun run changelog` (or `bun run changelog --dry` to preview). It generates the entry with `changelogen` from the previous `v*` release tag to `HEAD`. It refuses to run for 0.1.0, before `v0.1.0` exists, or from a tag that does not contain the imported history, so the imported commits never show up. Run it from a full clone: in a shallow clone it stops with git's error and asks for `git fetch --unshallow --tags`.

**Package check.** `npm pack --dry-run` lists only `dist/`, `LICENSE`, `README.md`, and `package.json`. The contract test packs the package and checks this.

**First release (0.1.0), after approval:**

1. From a clean checkout of the release commit on `master`, run `bun install --frozen-lockfile`, `bun run build`, and `bun run test`.
2. Tag `v0.1.0` on that commit and push the tag.
3. `npm login` (interactive 2FA), then `npm publish --access public --ignore-scripts`. This first publish has no npm provenance.
4. Do **not** create a GitHub Release for 0.1.0. It would start `publish.yml`, which fails because 0.1.0 is already on npm.
5. On npmjs.com → `@webflare/ui` → Settings → Trusted Publisher → GitHub Actions: organization `webflare-sh`, repository `ui`, workflow `publish.yml`, environment `npm-publish`. This works only after 0.1.0 exists.

**Later releases (0.1.1 or later):** bump the versions, run `bun run changelog`, merge through a pull request, tag `v<version>` on `master`, and publish a GitHub Release for that tag. CI builds, tests, and publishes with provenance.

Optional hardening, at any time: require 2FA and a second owner for the npm organization, and require a reviewer for the `npm-publish` environment.

## Key Dependencies

| Category | Packages |
|----------|----------|
| Runtime | bun, vue ^3.5, nuxt ^4.3, @pandacss/dev, reka-ui ^2.6 |
| Dev | vitest, @nuxt/test-utils, @nuxt/eslint-config, typescript ^5.9 |
| Build | tsup, vite, vue-tsc, @nuxt/module-builder |

## Design Tokens

- **Base Tokens**: Primitive values (colors, spacing, font sizes)
- **Semantic Tokens**: Context-aware with light/dark mode support
- **Responsive Breakpoints**: Mobile-first with named breakpoints

## Testing Guidelines

Vitest with `@nuxt/test-utils`. Test files in `packages/nuxt/test/*.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({ rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)) })
  it('renders the index page', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })
})
```

## Important Notes

1. Token changes: base tokens live in one file per kind under `packages/preset/src/tokens/` (`colors.ts`, `spacing.ts`, `radii.ts`, `typography.ts`, `sizes.ts`, `motion.ts`, `breakpoints.ts`); mode-dependent and alias tokens go in `semantic-tokens.ts`. Register a new category in `packages/preset/src/index.ts`
2. New packages: register in root `package.json` under `workspaces`
3. Build order: Nuxt module requires preset built first (automatic)
4. Peer dependencies: `vue`, `reka-ui`, and `@pandacss/dev` are required. `@pandacss/preset-base` is a published `dependency` (the design-system preset inlines the module; apps on `designSystem` do not install it). `nuxt` and `@nuxt/kit` are optional (only `@webflare/ui/nuxt`). Do not put `@nuxt/kit` in published `dependencies`.
5. No Prettier: ESLint used for formatting (stylistic rules)
6. Do not ship compiled Panda CSS (`panda cssgen`, `styles.css`, `panda.css`). Publish only the root `@webflare/ui` package. Consuming apps must depend on `@pandacss/dev`, keep their own `panda.config.ts`, and set `designSystem: '@webflare/ui'` (no Webflare preset, no `include` into the package). The library build runs `panda lib --outdir dist --files './**/*.{js,mjs}' --panda '^2.4.0'` after assembling `dist/`. That command owns `./panda/*`, `./css`, `./tokens`, `./types`, and other generated subpaths — do not hand-edit them. Custom exports (`./design-preset`, `./preset`, `./nuxt`, `./vue/*`, `./style.css`) stay in `package.json`. `@webflare/ui/style.css` is Iconify icons only: do not add `<style>` blocks to components. The root `panda.config.ts` sets `forceImportExtension: true` so the published runtime loads in plain Node. Pack root `dist/` only (assembled from workspace build outputs, including `dist/panda/` and `dist/styled-system/`) — do not include nested `packages/*/dist`.
