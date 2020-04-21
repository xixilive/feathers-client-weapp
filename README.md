## The [feathersjs](https://github.com/feathersjs) client binding for 微信小程序

[![Build Status](https://travis-ci.org/xixilive/feathers-weapp.svg?branch=master)](https://travis-ci.org/xixilive/feathers-weapp)
![npm (scoped)](https://img.shields.io/npm/v/@feathers-weapp/client)

## Install

```sh
npm i @feathers-weapp/client
```

## Usage

### use feathers services only

```js
import {feathers} from '@feathers-weapp/client'

const app = feathers('https://endpoint.api')

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