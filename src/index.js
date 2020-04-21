/* global App, Page */
import feathers from './feathers'
import storage from './storage'
import bindApps from './bind'

const setup = (feathersOptions, wxAppOptions) => {
  const app = feathers(feathersOptions)
  const bind = bindApps(App, Page, app)
  return bind(wxAppOptions)
}

export {
  feathers,
  storage,
  setup,
  bindApps
}