import { type App } from 'vue'
import { loadLodash } from './lodash'
import { loadPanzoom } from './panzoom'
import { loadQuasar } from './quasar'
import { loadSignaturePad } from './signaturePad'
import { loadStringFormat } from './stringFormat'
import { loadASDFComponents } from './asdf'
import { loadApexCharts } from './apexCharts'
// import { loadVueFlow } from './vueFlow'

export function loadPlugins(app: App) {
  loadLodash(app)
  loadPanzoom(app)
  loadQuasar(app)
  loadSignaturePad(app)
  loadStringFormat(app)
  loadASDFComponents(app)
  loadApexCharts(app)
  // loadVueFlow(app)
}
