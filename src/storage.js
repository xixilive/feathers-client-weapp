const promisify = (fn) => (options = {}) => {
  return new Promise((resolve, reject) => {
    fn({
      ...options,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

export default (wx) => ({
  getItem: wx.getStorageSync,
  setItem: wx.setStorageSync,
  removeItem: wx.removeStorageSync,
  clear: wx.clearStorageSync,
  getItemAsync: promisify(wx.getStorage),
  setItemAsync: promisify(wx.setStorage),
  removeItemAsync: promisify(wx.removeStorage),
  clearAsync: promisify(wx.clearStorage)
})
