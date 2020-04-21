global.wx = (['get', 'set', 'remove', 'clear']).reduce((memo, op) => {
  memo[`${op}Storage`] = jest.fn(({success}) => success(true))
  memo[`${op}StorageSync`] = jest.fn(() => true)
  return memo;
}, {})

// in test case, use commonjs to make global.wx declaration works
// the `import` syntx not works here
const {default:storage} = require('../src/storage')

describe('storage', () => {
  it('sync methods', () => {
    expect(storage.getItem('key')).toEqual(true)
    expect(wx.getStorageSync).toHaveBeenCalledWith('key')

    expect(storage.setItem('key', 'value')).toEqual(true)
    expect(wx.setStorageSync).toHaveBeenCalledWith('key', 'value')

    expect(storage.removeItem('key')).toEqual(true)
    expect(wx.removeStorageSync).toHaveBeenCalledWith('key')

    expect(storage.clear()).toEqual(true)
    expect(wx.clearStorageSync).toHaveBeenCalled()
  })

  it('async methods', async () => {
    expect(await storage.getItemAsync('key')).toEqual(true)
    expect(wx.getStorage).toHaveBeenCalled()

    expect(await storage.setItemAsync('key', 'value')).toEqual(true)
    expect(wx.setStorage).toHaveBeenCalled()

    expect(await storage.removeItemAsync('key')).toEqual(true)
    expect(wx.removeStorage).toHaveBeenCalled()

    expect(await storage.clearAsync()).toEqual(true)
    expect(wx.clearStorage).toHaveBeenCalled()
  })
})