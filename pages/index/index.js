//index.js
//获取应用实例
const app = getApp()
const api = require('../../utils/http.js')
const util = require('../../utils/util.js')

Page({
  data: {
    bookshelf: [],
    userInfo: {},
    loading: false,
    touchStart: 0,
    touchEnd: 0,
    hasUserInfo: false,
    imageUrl: app.globalData.imageUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        // this.syncBookshelf()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow() {
    this.syncBookshelf()
  },
  syncBookshelf () {
    let bookshelf = util.getStorage("bookshelf")
    let topping = bookshelf.filter(item => item.order)
    topping.sort((a, b) => b - a)
    let booklist = bookshelf.filter(item => !item.order)
    bookshelf = topping.concat(booklist)
    this.setData({ bookshelf, loading: true })
  },
  onPullDownRefresh () {
    wx.showNavigationBarLoading()
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  jumpRank () {
    wx.switchTab({
      url: '/pages/ranking/ranking',
    })
  },
  handleTopping (e) {
    let bookshelf = this.data.bookshelf
    let id = e.currentTarget.dataset.id
    let orders = bookshelf.filter(item => item.order)
    let current = null
    let int = 0
    bookshelf.some((item, index) => {
      if (item._id === id) {
        current = item
        int = index
        return true
      }
    })
    if (!current.order) {
      this.setXmove(int, 0)
      bookshelf.splice(int, 1)
      current.order = (orders.length + 1)
      bookshelf.unshift(current)
      setTimeout(() => {
        this.setData({ bookshelf: bookshelf })
        util.setStorage("bookshelf", bookshelf)
      }, 800)
    } else {
      this.setXmove(int, 0)
      let i = bookshelf.findIndex(item => !item.order)
      console.log(i)
      bookshelf.splice(int, 1)
      current.order = 0
      if (i > 0 ) {
        bookshelf.splice(i - 1, 0, current)
      } else {
        bookshelf.push(current)
      }
      setTimeout(() => {
        this.setData({ bookshelf: bookshelf })
        util.setStorage("bookshelf", bookshelf)
      }, 800)
    }
  },
  handleDelete(e) {
    let bookshelf = this.data.bookshelf
    let id = e.currentTarget.dataset.id
    let index = bookshelf.findIndex(item => item._id === id)
    if (bookshelf[index]) {
      this.setXmove(index, 0)
      bookshelf.splice(index, 1)
      setTimeout(() => {
        this.setData({ bookshelf: bookshelf })
        util.setStorage("bookshelf", bookshelf)
      }, 800)
    }
  },
  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
    this.setData({
      touchStart: e.timeStamp
    })
  },
  pressTap (e) {
    let id = e.currentTarget.dataset.id
    let touchTime = this.data.touchEnd - this.data.touchStart;
    if (touchTime > 500) { //自定义长按时长，单位为ms
      wx.navigateTo({
        url: `/pages/bookInfo/bookInfo?id=${id}`,
      })
    } else {
      console.log('点击')
    }
  },
  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    this.setData({
      touchEnd: e.timeStamp
    })
    if (e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if (e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },
  /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },
  /**
   * 设置movable-view位移
   */
  setXmove: function (index, xmove) {
    let bookshelf = this.data.bookshelf
    bookshelf.forEach(item => {
      item.xmove = 0
    })
    bookshelf[index].xmove = xmove
    this.setData({
      bookshelf: bookshelf
    })
  },
  /**
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, -150)
  },
  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let index = e.currentTarget.dataset.index
    this.setXmove(index, 0)
  },
})
