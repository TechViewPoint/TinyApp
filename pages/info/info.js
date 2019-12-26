//info.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    buildingArray: ['1栋', '2栋', '3栋', '4栋'],
    unitArray: ['1单元', '2单元', '3单元', '4单元'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    buildingIndex: 0,
    unitIndex: 0,
  },
  itemInfo: {}, 
  onLoad: function () {
    //itemInfo =wx.getStorageSync('itemInfo') || { name: 'Li Ming', build: 0,  unit: 0, house: '101' },
    this.setData({
      unitIndex: app.globalData.userInfo.unit,
      buildingIndex: app.globalData.userInfo.building,

    });
    
  },

  bindBuildingPickerChange: function (i) {
    console.log(i);
    this.setData({
      buildingIndex: i.detail.value,
    })
    app.globalData.userInfo.building = i.detail.value;
    wx.setStorageSync('globalData', app.globalData);
  },

  bindUnitPickerChange: function (i) {
    console.log(i);
    this.setData({
      unitIndex: i.detail.value
    })
    app.globalData.userInfo.unit = i.detail.value;
    wx.setStorageSync('globalData', app.globalData);
  },
})


