//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    printPicture:'打印照片',
    printDoc: '打印文档',
    
    userInfo: {},
    
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      
      url: '../logs/logs'
    })
  },
  bindPrintPictureTap: function () {
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        app.userInfoData.imageFiles = tempFilePaths;
        /*wx.uploadFile({
          url: 'https://localhost:44381/', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success(res) {
            const data = res.data
            console,log("ok");
            //do something
            
          }
        })*/
        wx.navigateTo({

          url: '../info/info'
        })
      }
    });
    
  },
  bindPrintDocTap: function () {

    wx.chooseMessageFile({
      type: 'file',
      success(res){
        const tempFilePaths = res.tempFiles;
        for (var i = 0; i < tempFilePaths.length;i++)
        {
          console.log(tempFilePaths[i]);
        }
        wx.openDocument({
          filePath: tempFilePaths[0],
          success: (res) => {
            console.log('读取成功', res)
          },
          fail: (err) => {
            console.log('读取失败', err)
          }
        })
      }
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
  }
})
