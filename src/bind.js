const createEmitter = feathersApp => {
  return {
    on(event, listener) {
      feathersApp.on(`weapp_${event}`, listener);
      return () => feathersApp.removeListener(`weapp_${event}`, listener)
    },
    once(event, listener){
      feathersApp.once(`weapp_${event}`, listener)
    },
    emit(event, data) {
      feathersApp.emit(`weapp_${event}`, data)
    }
  }
}

const bindApps = (wxApp, wxPage, feathersApp) => {
  if('function' !== typeof wxApp) {
    throw new Error('invalid weixin App global function');
  }

  const authentication = {}
  const emitter = createEmitter(feathersApp)

  feathersApp.once('authenticated', ({user}) => emitter.emit('authenticated', {user}))

  const bindAuthentication = function(page) {
    page.setData({authentication: wxApp.authentication})
    if(wxApp.authentication.authenticated) {
      return
    }
    emitter.once('authenticated', (payload) => {
      page.setData({authentication: payload});
    })
  }

  Object.defineProperty(wxApp, 'feathers', {
    configurable: false,
    enumerable: false,
    get(){
      return feathersApp
    }
  })

  Object.defineProperty(wxApp, 'authentication', {
    configurable: false,
    enumerable: false,
    get(){
      return authentication
    }
  })

  Object.defineProperty(wxPage, 'bindAuthentication', {
    configurable: false,
    enumerable: false,
    get() {
      return bindAuthentication
    }
  })

  return function(options) {
    const reAuthenticate = async function() {
      try {
        const {user} = await feathersApp.authenticate()
        emitter.emit('authenticated', {authenticated: true, user})
      }catch(err){
        console.warn('reAuthenticate failed:', err)
      }
    }

    const {onLaunch: _onLaunch} = options
    const onLaunch = function(opts){
      _onLaunch && _onLaunch(opts)
      emitter.once('authenticated', res => {
        Object.assign(authentication, {...res, authenticated: true})
      })
      reAuthenticate()
    }

    wxApp({...options, onLaunch})
    return true
  }
}

export default bindApps