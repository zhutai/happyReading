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
const baseUrl = 'http://novel.juhe.im';
// tag [东方玄幻、异界大陆、异界争霸、远古神话]
Page({
  data: {
    isTabbar: false,
    loading: false,
    isLoading: false,
    isHideLoadMore: false,
    tabArray: [],
    page: {
      start: 0,
      limit: 20
    },
    scrollTop: 0,
    params: {},
    bookList: [],
    imageUrl: app.globalData.imageUrl
  },
  onLoad: function (option) {
    let { id, major, gender, query, author, type } = option
    // 根据排行榜查询
    if (id) {
      tabRankArray.forEach((item, index) => {
        item.active = !index
      })
      this.setData({ tabArray: tabRankArray })
      this.queryRankTab(id)
    // 根据搜索查询
    } else if(query){
      this.isTabbar = true
      wx.setNavigationBarTitle({
        title: `搜索 "${query}"`
      })
      this.querySearch(query)
    } else if (major && gender){
      tabTypeArray.forEach((item, index) => {
        item.active = !index
      })
      this.setData({ tabArray: tabTypeArray, params: { major, gender } })
      this.queryTypeTab(major, gender)
    } else if (author) {
      this.isTabbar = true
      wx.setNavigationBarTitle({
        title: `查询作者 "${author}"的书`
      })
      this.queryAuthorBooks(author)
    } else {
      this.isTabbar = true;
      wx.setNavigationBarTitle({
        title: "你可能感兴趣"
      })
      this.querySimilarList()
    }
  },
  querySimilarList() {
    let { similarList } = app.globalData;
    this.setData({ bookList: similarList })
  },
  queryAuthorBooks(author) {
    wx.showLoading({
      title: "数据加载中",
      mask: true,
      success: () => {
        api._get(`${baseUrl}/author-books`, { author }).then(res => {
          if (res.ok) {
            const books = res.books
            this.setData({ bookList: books, loading: true })
          }
        })
      }
    })
  },
  querySearch(name) {
    wx.showLoading({
      title: "数据加载中",
      mask: true,
      success: () => {
        api._get("/book/fuzzy-search", { query: name }).then(res => {
          if (res.ok) {
            const books = res.books
            books.forEach(item => {
              item.majorCate = item.cat
            })
            this.setData({ bookList: books, loading: true })
          }
        })
      }
    })
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
        wx.setNavigationBarTitle({
          title: this.data.params.major
        })
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
        let isLoading = res.total > this.data.page.limit
        let bookList = isMerge ? this.data.bookList.concat(res.books)  : res.books
        this.setData({ bookList: bookList, isHideLoadMore: false, loading: true, isLoading })
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
    this.setData({ tabArray, scrollTop: 0 })
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
  scrollBottom () {
    if (!this.data.isLoading) return false
    let current = this.data.tabArray.find(item => item.active)
    if (current.type === "classify") {
      let { start, limit } = this.data.page
      this.setData({ page: { start: start += 20, limit: limit += 20 }, isHideLoadMore: true })
      this.getBooks(true)
    }
  }
})
