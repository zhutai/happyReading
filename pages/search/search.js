//search.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()

// const historyList = [
//   { name: "斗罗大陆" },
//   { name: "灭世魔帝" },
//   { name: "飞剑问道" },
//   { name: "阳神" },
// ]

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    isContent: false,
    loading: false,
    searchList: [],
    searchHotWords: [],
    historyList: [],
    cursor: 0
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
        let historyList = util.getStorage("searchHistroy")
        this.setData({ searchHotWords, loading: true, historyList })
      }
    })
  },
  onShow() {
    let historyList = util.getStorage("searchHistroy")
    this.setData({ inputVal: "", historyList, inputShowed: false })
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
  searchMain: function(event) {
    let { name } = event.currentTarget.dataset
    const searchHistroy = util.getStorage("searchHistroy")
    searchHistroy.forEach((item, index) => {
      if (item.name === name) {
        searchHistroy.splice(index, 1)
      }
    })
    if (searchHistroy.length >= 10) {
      searchHistroy.length = 9
    }
    searchHistroy.unshift({ name })
    util.setStorage("searchHistroy", searchHistroy)
    let url = `/pages/list/list?query=${name}`
    wx.navigateTo({ url: url })
  },
  inputTyping: function (e) {
    let { value, cursor } = e.detail
    this.setData({
      inputVal: value
    });
    if (cursor !== this.data.cursor) {
      this.setData({ cursor })
      api._get("/book/auto-complete", { query: value }).then(res => {
        if (res.ok) {
          this.setData({ cursor, searchList: res.keywords })
        }
      })
    }
  }
});
