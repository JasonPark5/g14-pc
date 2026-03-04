import { type App } from 'vue'
import * as ASDFConponents from '@/components'

export function loadASDFComponents(app: App) {
  /** ASDF Components load */
  for (const [key, component] of Object.entries(ASDFConponents)) {
    app.component(key, component)
  }
}
