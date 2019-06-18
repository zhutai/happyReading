//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()
const baseUrl  = 'http://novel.juhe.im';
const similarList = [
  { cover: '/static/image/image.jpg', _id: 1 },
  { cover: '/static/image/image.jpg', _id: 2 },
  { cover: '/static/image/image.jpg', _id: 3 },
  { cover: '/static/image/image.jpg', _id: 4 },
  { cover: '/static/image/image.jpg', _id: 5 },
  { cover: '/static/image/image.jpg', _id: 6 },
  { cover: '/static/image/image.jpg', _id: 7 },
  { cover: '/static/image/image.jpg', _id: 8 },
]
Page({
  data: {
    loading: false,
    isHide: false,
    isBookshelf: false,
    bookInfo: null,
    similarList: similarList,
    imageUrl: app.globalData.imageUrl
  },
  onLoad: function (option) {
    wx.showLoading({ 
      title: "数据加载中",
      mask: true,
      success: () => {
        api._get(`/book/${option.id}`).then(res => {
          let bool = this.isNotBookshelf(option.id)
          let time = new Date(res.updated).getTime()
          let transWordCount = util.tranNumber(res.wordCount)
          let formatPassTime = util.formatPassTime(time)
          res.transWordCount = transWordCount
          res.formatPassTime = formatPassTime
          wx.setNavigationBarTitle({
            title: res.title,
          })
          this.setData({ bookInfo: res, isBookshelf: bool})
          return api._get(`${baseUrl}/recommend/${option.id}`)
        }).then(res => {
          if (res.ok) {
            let similarList = []
            for (let i = 0; i < 8; i++) {
              let index = util.randomNum(0, res.books.length)
              similarList.push(res.books[index])
            }
            app.globalData.similarList = res.books
            app.globalData.similarId = option.id
            this.setData({ similarList: similarList })
          }
        })
      }
    })
  },
  isNotBookshelf(id) {
    let bool = false
    let bookshelf = util.getStorage("bookshelf")
    bookshelf.some((item, index) => {
      if (item._id === id) {
        bool = true
        return true
      }
    })
    return bool
  },
  addBookshelf() {
    let current = null
    let isBookshelf = this.data.isBookshelf
    let bookshelf = util.getStorage("bookshelf")
    let id = this.data.bookInfo.id
    if (isBookshelf) {
      bookshelf.some((item, index) => {
        if (item.id === id) {
          bookshelf.splice(index, 1)
          wx.showToast({
            title: '移出成功',
            icon: 'success',
            duration: 2000
          });
          return true
        }
      })
      isBookshelf = false
    } else {
      let { cover, title, formatPassTime, lastChapter, _id } = this.data.bookInfo
      bookshelf.unshift({ _id, cover, lastChapter, formatPassTime, title })
      isBookshelf = true
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 2000
      });
    }
    util.setStorage("bookshelf", bookshelf)
    this.setData({ isBookshelf })
  },
  startReading () {

  },
  previewAll() {
    this.setData({ isHide: !this.data.isHide })
  },
  jumpList(event) {
    if (this.data.bookInfo && this.data.bookInfo._id) {
      let url = `/pages/list/list`
      wx.navigateTo({ url: url })
    }
  }
})
