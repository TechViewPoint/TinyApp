const { $Toast } = require('../../lib/iview/base/index');
const app = getApp()
const DB = wx.cloud.database()
Page({
  data: {
    functions: [
      {
        name:'打印照片',
        icon:"picture_fill",
        index:0,
      },
      
      {
        name: '打印文档',
        icon: "document",
        index:1,
      },
      {
        name: '我的订单',
        icon: "task",
        index: 2,

      },
      /*
      {
        name: '在线商城',
        icon: "homepage",
        index: 3,
      },
      {
        name: '文体活动',
        icon: "flashlight",
        index: 4,
      },
      
      {
        name: '家教辅导',
        icon: "brush",
         index: 5,
      },
      {
        name: '二手出售',
        icon: "commodity",
        index: 6,
          
      },
      {
        name: 'PS修图',
        icon: "interactive",
        index: 7,
      },*/
      {
        name: '关于',
        icon: "feedback",
        index: 8,

      },],
    printPicture:'打印照片',
    printDoc: '打印文档',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  gridTapHandle:function(t)
  {
    //console.log("grid tap",t);
    var index = t.currentTarget.dataset.task.index;
      if (index == 0)
      {
        //console.log("start");
        wx.navigateTo({
          url: '../imageUpload/imageUpload'
        });
        //console.log("end")
      }
      else if (index == 1)
      {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index == 2) {
        this.lookupOrder();
      }
      else if (index == 3) {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index == 4) {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index == 5) {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index == 6) {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index ==7) {
        $Toast({
          content: '该功能暂未开通'
        });
      }
      else if (index == 8) {
        wx.navigateTo({
          url: '../about/about'
        });
      }
    
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
    //console.log(e)
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
