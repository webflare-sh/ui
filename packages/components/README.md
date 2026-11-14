# Internal: Vue components

Workspace package used to build the Vue components that `@webflare/ui` and `@webflare/ui/components` export.

This folder is **not** published to npm. Consume the design system as `@webflare/ui`.

```ts
import { Button } from '@webflare/ui'
import '@webflare/ui/style.css'
```

Component styles are `cva` / `sva` definitions in each component's `styles.ts`. Components import `styled-system/css`, which the build rewrites to `@webflare/ui/css`.

See the [root README](../../README.md) for install, Panda config, and publishing.
