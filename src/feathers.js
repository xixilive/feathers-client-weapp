import feathers from '@feathersjs/client'
import fetch from '@xixilive/weapp-fetch'

import storage from './storage'

const defaultOptions = {
  headers: {},
  tokenStorageKey: 'access_token'
}

const createApp = function(options = {}) {
  const config = Object.assign({}, defaultOptions, ('string' === typeof options ? {endpoint: options} : options))
  const rest = feathers.rest(config.endpoint).fetch(fetch, { headers: config.headers })
  const auth = feathers.authentication({ storage, storageKey: config.tokenStorageKey })
  const app = feathers().configure(rest).configure(auth)

  const _authenticate = app.authenticate.bind(app)

  app.authenticate = async (credential = null) => {
    try{
      const {accessToken, user} = await (credential ? _authenticate(credential) : app.reAuthenticate())
      return {accessToken, user}
    }catch(err){
      if(!credential) {
        storage.removeItem(config.tokenStorageKey)
      }
      const error = new Error('auth failure')
      error.withCredential = !!credential
      throw error
    }
  }

  return app
}

export default createApp
