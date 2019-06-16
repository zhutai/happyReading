const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getUrlKey = name => {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}

const randomColor = () => {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  let rgb = '(' + r + ',' + g + ',' + b + ',0.8)';
  return rgb
}

const randomNum = (min, max)  => {
  return Math.floor(min + Math.random() * (max - min));
}

const setStorage = (key, value) => {
  let data = JSON.stringify(value)
  try {
    wx.setStorageSync(key, data)
  } catch (e) { 
    wx.showToast({
      title: '加载异常',
      icon: 'none',
      duration: 2000
    });
  }
}

const getStorage = (key) => {
  let data = wx.getStorageSync(key) || "[]"
  try {
    data = JSON.parse(data)
  } catch (e) {
    wx.showToast({
      title: '加载异常',
      icon: 'none',
      duration: 2000
    });
  }
  return data
}

module.exports = {
  getStorage: getStorage,
  setStorage: setStorage,
  randomNum: randomNum,
  randomColor : randomColor,
  getUrlKey: getUrlKey,
  formatTime: formatTime
}
