const app = {
  onLaunch: jest.fn(() => {}),
  reAuthOnLaunch: true
}

const component = {
  setData: jest.fn(() => {})
}

const feathers = {
  once: jest.fn(() => {}),
  on: jest.fn(() => {}),
  emit: jest.fn(() => {}),
  authenticate: jest.fn(() => Promise.resolve({user: 'user'}))
}

global.App = ({onLaunch}) => {
  onLaunch && onLaunch('options')
}
global.Page = () => {}
global.getApp = () => app

const bindApps = require('../src/bind').default

const wait = (n) => new Promise((resolve) => setTimeout(resolve, n))

describe('bind', () => {
  bindApps(App, Page, feathers)(app)
  it('should be defined', async () => {
    expect(App.feathers).toEqual(feathers)
    expect(App.authentication).toEqual({})
    expect(Page.bindAuthentication).toBeDefined()
    await wait(1); // authenticate resolved in next tick
    expect(app.onLaunch).toHaveBeenCalledWith('options')
    expect(feathers.authenticate).toHaveBeenCalledTimes(1)
    expect(feathers.emit).toHaveBeenCalledWith('weapp_authenticated', {user: 'user', authenticated: true})
  })
})