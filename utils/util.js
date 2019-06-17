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

const tranNumber = (num) => {
  let numStr = num.toString()
  let index = 0
  let str = ''
  let obj = {
    4: 0,
    5: 1,
    6: 2,
    7: 3,
    8: 4
  }
  index = obj[numStr.length]
  if (index) {
    str = numStr.slice(0, index) + "万"
  } else {
    str = "1万"
  }
  return str
}

const formatPassTime = (startTime) => {
  var currentTime = new Date().getTime(),
    time = currentTime - startTime,
    day = parseInt(time / (1000 * 60 * 60 * 24)),
    hour = parseInt(time / (1000 * 60 * 60)),
    min = parseInt(time / (1000 * 60)),
    month = parseInt(day / 30),
    year = parseInt(month / 12);
  if (year) return year + "年前"
  if (month) return month + "个月前"
  if (day) return day + "天前"
  if (hour) return hour + "小时前"
  if (min) return min + "分钟前"
  else return '刚刚'
}

module.exports = {
  getStorage: getStorage,
  setStorage: setStorage,
  randomNum: randomNum,
  randomColor : randomColor,
  tranNumber: tranNumber,
  formatPassTime: formatPassTime,
  getUrlKey: getUrlKey,
  formatTime: formatTime
}
