//logs.js
const util = require('../../utils/util.js')
const api = require('../../utils/http.js')
const app = getApp()
const tabArray = [
  { label: '男生', value: 'male', active: true },
  { label: '女生', value: 'female', active: false }
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
        api._get('/ranking/gender').then(res => {
          if (res.ok) {
            let cruuentTab = this.data.tabArray.find(item => item.active)
            let currentList = res[cruuentTab.value]
            this.setDataFormet(currentList)
            this.setData({ classifyList: res })
          }
        })
      }
    })
  },
  jumpList(event) {
    let { params } = event.currentTarget.dataset
    app.globalData.enterList = params
    let url = '/pages/list/list?id=' + params._id
    wx.navigateTo({ url: url })
  },
  setDataFormet(list) {
    const official = {
      name: "官方榜单",
      index: 0,
      list: list.filter(item => !item.collapse && item.monthRank)
    }
    const thirdParty = {
      name: "第三方榜单",
      index: 0,
      list: list.filter(item => item.collapse)
    }
    this.setData({ currentList: { official, thirdParty }, loading: true })
  },
  tabToggle(event) {
    let { value } = event.currentTarget.dataset
    let tabArray = this.data.tabArray
    tabArray.forEach(item => 　{
      item.active = false
      if (item.value === value) {
        item.active = true
        let currentList = this.data.classifyList[value]
        this.setDataFormet(currentList)
      }
    })
    this.setData({ tabArray })
  }
})
