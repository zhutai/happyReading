//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()
const tabRankArray = [
  { type: 'rank', label: '周榜', value: '_id', active: true },
  { type: 'rank', label: '月榜', value: 'monthRank', active: false },
  { type: 'rank', label: '总榜', value: 'totalRank', active: false }
]
const tabTypeArray = [
  { type: 'classify', label: '热门', value: 'hot', active: true },
  { type: 'classify', label: '新书', value: 'new', active: false },
  { type: 'classify', label: '好评', value: 'reputation', active: false },
  { type: 'classify', label: '完结', value: 'over', active: false }
]
// tag [东方玄幻、异界大陆、异界争霸、远古神话]
Page({
  data: {
    isTabbar: false,
    loading: false,
    tabArray: [],
    page: {
      start: 0,
      limit: 20
    },
    params: {},
    bookList: [],
    imageUrl: app.globalData.imageUrl
  },
  onLoad: function (option) {
    let { id, major, gender } = option
    if (id) {
      this.isTabbar = false
      tabRankArray.forEach((item, index) => {
        item.active = !index
      })
      this.setData({ tabArray: tabRankArray })
      this.queryRankTab(id)
    } else {
      tabTypeArray.forEach((item, index) => {
        item.active = !index
      })
      this.setData({ tabArray: tabTypeArray, params: { major, gender } })
      this.queryTypeTab(major, gender)
    }
  },
  queryRankTab (id) {
    wx.showLoading({
      title: "数据加载中",
      mask: true,
      success: () => {
        api._get(`/ranking/${ id }`).then(res => {
          if (res.ok) {
            wx.setNavigationBarTitle({
              title: res.ranking.title
            })
            this.setData({ bookList: res.ranking.books, loading: true })
          }
        })
      }
    })
  },
  queryTypeTab() {
    wx.showLoading({
      title: "数据加载中",
      mask: true,
      success: () => {
        this.getBooks()
      }
    })
  },
  getBooks(isMerge = false) {
    let { major, gender } = this.data.params
    let { start, limit } = this.data.page
    let current = this.data.tabArray.find(item => item.active)
    let params = { type: current.value, start, limit, major, gender }
    api._get('/book/by-categories', params).then(res => {
      if (res.ok) {
        wx.setNavigationBarTitle({
          title: major
        })
        let bookList = isMerge ? this.data.bookList.concat(res.books)  : res.books
        this.setData({ bookList: bookList, loading: true })
      }
    })
  },
  tabToggle(event) {
    let { value, type } = event.currentTarget.dataset
    let tabArray = this.data.tabArray
    tabArray.forEach(item => 　{
      item.active = false
      if (item.value === value) {
        item.active = true
        this.switchClick(type, value)
      }
    })
    this.setData({ tabArray })
  },
  switchClick(type, value) {
    this.setData({page: { start: 0, limit: 20 }})
    if (type === 'rank') {
      let enter = app.globalData.enterList
      let id = enter[value]
      this.queryRankTab(id)
    } else if (type === 'classify') {
      let { major, gender } = this.data.params
      this.queryTypeTab(major, gender)
    }
  },
  scrolltolower () {
    console.log(123)
  },
  scrollBottom () {
    wx.hideLoading()
    let { start, limit } = this.data.page
    this.setData({ page: { start: start += 20, limit: limit += 20 } })
    this.getBooks(true)
  },
  onReachBottom(event) {
    console.log(event)
  }
})
