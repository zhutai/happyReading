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
          console.log(res)
          let time = new Date(res.updated).getTime()
          let transWordCount = util.tranNumber(res.wordCount)
          let formatPassTime = util.formatPassTime(time)
          res.transWordCount = transWordCount
          res.formatPassTime = formatPassTime
          this.setData({bookInfo: res})
          return api._get(`${baseUrl}/recommend/${option.id}`)
        }).then(res => {
          if (res.ok) {
            let similarList = []
            for (let i = 0; i < 8; i++) {
              let index = util.randomNum(0, res.books.length)
              similarList.push(res.books[index])
            }
            app.globalData.similarList = res.books
            this.setData({ similarList: similarList })
          }
        })
      }
    })
  },
  addBookshelf() {

  },
  startReading () {

  },
  previewAll() {
    // console.log(this.data.isHide)
    this.setData({ isHide: !this.data.isHide })
    // console.log(this.data.isHide)
  },
  jumpList(event) {
    let { name } = event.currentTarget.dataset
    let current = tabArray.find(item => item.active)
    let gender = current.value
    console.log(gender)
    let url = `/pages/list/list?major=${name}&gender=${gender}`
    wx.navigateTo({ url: url })
  }
})
