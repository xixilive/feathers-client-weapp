/* global App, Page */
import fetch, {http, Logger} from '@xixilive/weapp-fetch'
import feathers from './feathers'
import storage from './storage'
import bindApps from './bind'

const setup = (feathersOptions, wxAppOptions) => {
  const app = feathers(feathersOptions)
  const initApp = bindApps(App, Page, app)
  return initApp(wxAppOptions)
}

export {
  feathers,
  storage,
  setup,
  bindApps,
  
  fetch,
  http,
  Logger
}