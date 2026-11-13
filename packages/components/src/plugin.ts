import type { App, Component, Plugin } from 'vue'
import * as components from './vue-components'

export const WfUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component as Component)
    }
  },
}

export default WfUI
