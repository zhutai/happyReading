//search.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    isSearch: false,
    isRefresh: false,
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
    this.getHotTag()
  },
  onShow() {
    let historyList = util.getStorage("searchHistroy")
    this.setData({ inputVal: "", historyList, inputShowed: false })
  },
  getHotTag() {
    this.setData({ isRefresh: true } )
    api._get('/book/search-hotwords').then(res => {
      if (res.ok) {
        let searchHotWords = []
        for (let i = 0; i < 12; i++) {
          let index = util.randomNum(0, res.searchHotWords.length)
          searchHotWords.push(res.searchHotWords[index])
        }
        searchHotWords.forEach(item => {
          item.color = util.randomColor()
        })
        let historyList = util.getStorage("searchHistroy")
        this.setData({ searchHotWords, loading: true, historyList, isRefresh: false })
      }
    })
  },
  clearHistroy () {
    wx.showModal({
      title: '提示',
      content: '确定删除搜索历史？',
      confirmText: "确定",
      cancelText: "取消",
      success: (res) => {
        console.log(res);
        if (res.confirm) {
          let historyList = util.setStorage("searchHistroy", [])
          this.setData({ historyList: [] })
        } else {
          console.log('用户取消了')
        }
      }
    });
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
      inputVal: value,
      isSearch: false
    });
    if (cursor !== this.data.cursor) {
      this.setData({ cursor })
      api._get("/book/auto-complete", { query: value }).then(res => {
        if (res.ok) {
          this.setData({ cursor, searchList: res.keywords, isSearch: true })
        }
      })
    }
  }
});
