//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()
const tabArray = [
  { label: '男生小说', value: 'male', active: true },
  { label: '女生小说', value: 'female', active: false },
  { label: '网络小说', value: 'picture', active: false },
  { label: '出版图书', value: 'press', active: false },
]

Page({
  data: {
    loading: false,
    tabArray,
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
            let cruuentTab = this.data.tabArray.find(item => item.active)
            let currentList = res[cruuentTab.value]
            this.setData({ currentList, classifyList: res, loading: true })
          }
        })
      }
    })
  },
  jumpList(event) {
    let { name } = event.currentTarget.dataset
    let current = tabArray.find(item => item.active)
    let gender = current.value
    console.log(gender)
    let url = `/pages/list/list?major=${name}&gender=${gender}`
    wx.navigateTo({ url: url })
  },
  tabToggle(event) {
    let { value } = event.currentTarget.dataset
    let tabArray = this.data.tabArray
    tabArray.forEach(item =>　{
      item.active = false
      if (item.value === value) {
        item.active = true
        let currentList = this.data.classifyList[value]
        this.setData({ currentList })
      }
    })
    console.log(this.data.currentList)
    this.setData({ tabArray })
  }
})
