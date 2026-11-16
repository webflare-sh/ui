import type { App, Component, Plugin } from 'vue'
import * as components from './vue-components'

export interface WfUIOptions {
  /**
   * Prefix for globally registered components.
   * `Button` becomes `WfButton` when prefix is `Wf`.
   * @default 'Wf'
   */
  prefix?: string
}

export const WfUI: Plugin<[WfUIOptions?]> = {
  install(app: App, options?: WfUIOptions) {
    const prefix = options?.prefix ?? 'Wf'
    for (const [name, component] of Object.entries(components)) {
      app.component(`${prefix}${name}`, component as Component)
    }
  },
}

export default WfUI
