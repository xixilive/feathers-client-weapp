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

### bind with wx App and Page

```js
// in App.js
import {feathers, bindApps, setup} from '@feathers-weapp/client'
const app = feathers('https://endpoint.api')

// bind
const setupWxApp = bindApps(App, Page, app)
setupWxApp({
  onLaunch(opts){
    // ...
  }
})

// or use shortcut
setup('https://endpoint.api', {
  onLaunch(opts){
    // ...
  }
})
```

Once bind with App, you can use:

- `App.feathers` to get the feathers app instance.
- `App.authentication` to get the current authentication state.
- `Page.bindAuthentication` to bind authentication state with current page, bind `this.data.authentication`. 

```js
// bindAuthentication example
// somepage.js
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
import {feathers, bindApps, setup, http, storage} from '@feather-weapp/client'
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
function bindApps(app: WxApp, page: WxPage, fapp: FeathersApplication): Binder;
```

#### Binder function

```ts
function Binder(wxAppOptions: object): bool;
```

### setup function

```ts
function setup(feathersOptions: string | feathersOptions, wxAppOptions: object): bool;
```

### http function

```ts
function http(base: string): httpInstance;
interface httpInstance {
  get(url: string, header?: any): Promise;
  post(url: string, data?: any, header?: any): Promise;
  put(url: string, data?: any, header?: any): Promise;
  patch(url: string, data?: any, header?: any): Promise;
  delete(url: string, header?: any): Promise;
}
```

#### http.request function

```ts
function request(options: WxRequestOptions): Promise;
```

#### http.interpolators object

```ts
interface http.interpolators {
  request(params: paramsObject): paramsObject;
  response(res: Response): Response;
}
```

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