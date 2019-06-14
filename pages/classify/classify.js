//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()
const classifyArray = [
  { label: '男生小说', value: 'male', active: true },
  { label: '女生小说', value: 'female', active: false },
  { label: '网络小说', value: 'picture', active: false },
  { label: '出版图书', value: 'press', active: false },
]

Page({
  data: {
    loading: false,
    classifyArray,
    classifyList: null,
    currentList: [],
    imageUrl: app.globalData.imageUrl
  },
  onLoad: function () {
    wx.showLoading({ 
      title: "数据加载中",
      mask: true,
      success: () => {
        api._get('/cats/lv2/statistics').then(res => {
          if (res.ok) {
            let cruuentTab = this.data.classifyArray.find(item => item.active)
            let currentList = res[cruuentTab.value]
            this.setData({ currentList, classifyList: res, loading: true })
          }
        })
      }
    })
  },
  tabToggle(event) {
    let { value } = event.currentTarget.dataset
    let classifyArray = this.data.classifyArray
    classifyArray.forEach(item =>　{
      item.active = false
      if (item.value === value) {
        item.active = true
        let currentList = this.data.classifyList[value]
        this.setData({ currentList })
      }
    })
    console.log(this.data.currentList)
    this.setData({ classifyArray })
  }
})
