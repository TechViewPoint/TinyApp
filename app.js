//app.js
App({
  onLaunch: function () {
    var that = this;
    this.userInfoData = wx.getStorageSync('userInfoData') || {}
    this.fillUserInfoData();
    wx.setStorageSync('userInfoData', this.userInfoData);
    
    //cloud env init
    wx.cloud.init()
    {
      env: "royhuang-v6urk"
    }
    if (!this.userInfoData.openid)
    {
      wx.cloud.callFunction(
        {
          name: "getOpenId",
          success(res) {
            that.userInfoData.openid = res.result.openid;
            //console.log("getOpenid Ok", that.userInfoData.openid);
            wx.setStorageSync('userInfoData', that.userInfoData);
          },
        })
    }
    
    

    /*
    // 登录
    wx.login({
      success: res => {
        console.log("login", res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    */
  },

  fillUserInfoData()
  {
    if(this.userInfoData.name==null)
    {
      this.userInfoData.name = "";
    }
    if(this.userInfoData.address ==null)
    {
      this.userInfoData.address = "";
    }
    if (this.userInfoData.phoneNum == null)
    {
      this.userInfoData.phoneNum = "";
    }
  },

  userInfoData:{},
  globalData: {
    userInfo: { }
  }
})