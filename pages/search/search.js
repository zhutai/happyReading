//search.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    loading: false,
    searchHotWords: []
    // 
  },
  onLoad() {
    wx.showLoading({
      title: "数据加载中",
      mask: true
    })
    api._get('/book/search-hotwords').then(res => {
      if (res.ok) {
        let searchHotWords = res.searchHotWords.splice(0, 12)
        searchHotWords.forEach(item => {
          item.color = util.randomColor()
        })
        this.setData({ searchHotWords, loading: true })
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
});
