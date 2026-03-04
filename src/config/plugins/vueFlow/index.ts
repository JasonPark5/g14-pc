import { type App } from 'vue'
import vueFlow from '@vue-flow/core'

export function loadVueFlow(app: App) {
  /** signature pad */
  app.use(vueFlow)
}
