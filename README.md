## To adapts feathers rest client for wechat mini-program 微信小程序

![Travis (.org) branch](https://img.shields.io/travis/xixilive/feathers-client-weapp/master)
![npm bundle size](https://img.shields.io/bundlephobia/min/@feathers-weapp/client)
![npm version](https://img.shields.io/npm/v/@feathers-weapp/client)
![Known Vulnerabilities](https://snyk.io/test/github/xixilive/feathers-client-weapp/badge.svg)
![NPM license](https://img.shields.io/npm/l/@feathers-weapp/client)

## Installation

```sh
# 小程序开发者工具构建npm包时仅处理production依赖,因此要加`--save-prod`
npm i @feathers-weapp/client --save-prod

# or
yarn add @feathers-weapp/client --save
```

## Usage

### use feathers services only

```js
import {feathers} from '@feathers-weapp/client'

const app = feathers('https://api.endpoint')

app.authenticate({strategy: 'weapp', code: 'logincode', ...})
  .then(res => console.log('authenticated', res))

app.service('something').once('created', data => console.log('created', data))
app.service('something').create(data).then(res => console.log('created', res))
```

### bind feathers app with wx App and Page

> **NOTE**: bind API makes `code pollution` in `App` and `Page`

```js
// in App.js
import {feathers, bindApps, setup} from '@feathers-weapp/client'
const app = feathers('https://endpoint.api')

// bind
const initApp = bindApps(App, Page, app)
initApp({
  onLaunch(opts){
    // ...
  },

  reAuthOnLaunch: true // will cause automatic JWT authentication on app launch.
})

// or use shortcut
setup('https://endpoint.api', {
  onLaunch(opts){
    // ...
  }
})
```

Once bind with `App` and `Page`, you can use:

- `App.feathers` to get the feathers app instance.
- `App.emitter` to get an event emitter API, which delegated to the feathersjs's emitter.
- `App.authentication` to get the current authentication state.
- `Page.bindAuthentication` to bind authentication state with current page, bind `this.data.authentication`. 

```js
/* emitter example */
const unsubscribe = App.emitter.on('event', () => {}) // subscribe
unsubscribe() //unsubscribe, be careful

App.emitter.once('event', () => {})
App.emitter.emit('event', 'event data')

/* bindAuthentication example */
Page({
  onLoad(){
    Page.bindAuthentication(this)
  },

  onTapAction() {
    if(!this.data.authentication.authenticated) {
      console.log('oops')
    }
  }
})
```

## Build Tips

This package was prebuilt as es module to `dist` folder, and all of source code not be transpiled to ES5 version.
If you use this package's default build, you should turn on the `ES6 to ES5` option in devtools.
If you want a custom build, please clone this repo.


## API

```js
// package's exports
import {feathers, bindApps, setup, storage} from '@feather-weapp/client'

// additional exports from @xixilive/weapp-fetch
import {fetch, http, Logger } from '@feather-weapp/client'
```

### feathers function

```ts
function feathers(options: string | feathersOptions): FeathersApplication;
```
#### feathersOptions

```ts
interface feathersOptions {
  endpoint: string;
  headers?: RequestHeader;
  tokenStorageKey?: string;
}
```

### bindApps function

```ts
function bindApps(app: WxApp, page: WxPage, fapp: FeathersApplication): InitApp;
```

#### InitApp function

```ts
function InitApp(wxAppOptions: object): void;
```

### setup function

```ts
function setup(feathersOptions: string | feathersOptions, wxAppOptions: object): bool;
```

### http/fetch/Logger functions

see [@xixilive/weapp-fetch](https://github.com/xixilive/weapp-fetch)

### storage interface

```ts
interface storage {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
  removeItem(key: string): void;
  clear(): void;

  getItemAsync(key: string): Promise<any>;
  setItemAsync(key: string, value: any): Promise<any>;
  removeItemAsync(key: string): Promise<any>;
  clearAsync(): Promise<any>;
}
```