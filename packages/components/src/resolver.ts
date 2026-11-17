import { componentNames } from './generated/componentNames'

export interface WebflareResolverOptions {
  /**
   * Prefix of the component tags in templates.
   * `WfButton` resolves to `Button` when prefix is `Wf`.
   * @default 'Wf'
   */
  prefix?: string
}

/** Structurally compatible with `ComponentResolver` from `unplugin-vue-components`. */
export interface WebflareComponentResolver {
  type: 'component'
  resolve: (name: string) => { name: string, from: string } | undefined
}

/**
 * Auto-import resolver for `unplugin-vue-components`. `<WfButton>` compiles to
 * `import { Button } from '@webflare/ui'`, the same tags the Nuxt module
 * registers. Nothing is registered globally.
 *
 * @example
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import WebflareResolver from '@webflare/ui/resolver'
 *
 * export default defineConfig({
 *   plugins: [vue(), Components({ resolvers: [WebflareResolver()] })],
 * })
 */
export function WebflareResolver(options: WebflareResolverOptions = {}): WebflareComponentResolver {
  const prefix = options.prefix ?? 'Wf'
  const names = new Set<string>(componentNames)

  return {
    type: 'component',
    resolve: (name) => {
      if (!name.startsWith(prefix)) return undefined
      const component = name.slice(prefix.length)
      return names.has(component) ? { name: component, from: '@webflare/ui' } : undefined
    },
  }
}

export default WebflareResolver
