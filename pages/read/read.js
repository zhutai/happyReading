// pages/read/read.js

const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    click: false, //是否显示弹窗内容
    option: false, //显示弹窗或关闭弹窗的操作动画
    touch: {
      x:0,
      y:0
    }
  },
  clickPup() {
    if (!this.data.click) {
      this.setData({
        click: true,
      })
    }

    if (this.data.option) {
      this.setData({
        option: false,
      })
      // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
      setTimeout(() => {
        this.setData({
          click: false,
        })
      }, 200)
    } else {
      this.setData({
        option: true
      })
    }
  },
  clickContent (e) {
    let { x, y } = e.detail;
    let vh = wx.getSystemInfoSync().windowHeight
    if (y > (vh / 2)) {
      console.log("下")
    } else {
      console.log("上")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})