//index.js
//获取应用实例
const app = getApp()
const DB = wx.cloud.database()
Page({
  data: {
    motto: 'Hello World',
    printPicture:'打印照片',
    printDoc: '打印文档',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  bindPrintPictureTap: function () {
    wx.navigateTo({
      url: '../imageUpload/imageUpload'
    })
  },
  bindPrintDocTap: function () {
    wx.navigateTo({
      url: '../imageUpload/imageUpload'
    })
  },

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
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
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
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  handleClick:function(){
    wx.showModal({
      content: "不可重复上传文件名相同的文件，如果此文件之前上传失败，请先从列表中将其关闭",
      showCancel: 1
    });
  },

  addUser:function(){
    DB.collection("user").add({
      data:{
        name:"roy",
        gender:true
      }
    })
  },

  deleteUser: function () {
    DB.collection("user").delete({
      data: {
        name: "roy",
        gender: true
      }
    })
  },
 
  callCloudFun:function(){
    wx.cloud.callFunction({
      name:"getOpenId",
      success(res){
        console.log("ok",res);
      },
      fail(res)
      {
        console.log("fail", res);
      }
    })
  },

  lookupOrder()
  {
    wx.navigateTo({
      url: '../orderList/orderList'
    })
  }
})
