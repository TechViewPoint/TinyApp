//info.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    buildingArray: ['1栋', '2栋', '3栋', '4栋'],
    unitArray: ['1单元', '2单元', '3单元', '4单元'],
    buildingIndex: 0,
    unitIndex: 0,
  },
  
  onLoad: function () {
    console.log(app.userInfoData.unit);
    this.setData({
      
      unitIndex: app.userInfoData.unit,
      buildingIndex: app.userInfoData.building,

    });
    console.log(app.userInfoData);
  },

  bindBuildingPickerChange: function (i) {
    
    this.setData({
      buildingIndex: i.detail.value,
    })
    app.userInfoData.building = i.detail.value;
    console.log(app.userInfoData);
    wx.setStorageSync('userInfoData', app.userInfoData);
  },

  bindUnitPickerChange: function (i) {
    
    this.setData({
      unitIndex: i.detail.value
    })
    app.userInfoData.unit = i.detail.value;
    wx.setStorageSync('userInfoData', app.userInfoData);
  },
})


