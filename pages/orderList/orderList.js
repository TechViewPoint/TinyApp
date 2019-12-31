// pages/orderlist/orderList.js

const DB = wx.cloud.database();
const app = getApp();
Page({

  data: {
    orders: []
  },

  onLoad: function (options) {
    this.updateOrderList();
  },

  updateOrderList()
  {
    var that = this;
    if (app.userInfoData.openid) {
      console.log("openid is local");
      DB.collection('order').where({
        userOpenId: app.userInfoData.openid
      }).get({
        success: function (res) {

          //handleData(res.data);
          that.setData(
            {
              orders: res.data
            });
        },
        fail(res) {
          console.log("get order fail", res);
        }
      })
    }
    else//if openid is not exist
    {
      console.log("openid is not local");
      wx.cloud.callFunction(
        {
          name: "getOpenId",
          success(res) {
            DB.collection('order').where({
              userOpenId: app.userInfoData.openid
            }).get({
              success: function (res) {

                //handleData(res.data);
                that.setData(
                  {
                    orders: res.data
                  });
              },
            })
          },
        })
    }   
  },

  handleData(data)
  {
    
    for(i =0;i<data.length;i++)
    {
      data[i].state = getOrderStateText(state);
    }
  },
  getOrderStateText(state)
  {
    switch(state)
    {
      case 0:
      return "待处理";
      case 1:
      return "处理中";
      case 2:
      return "等待配送";
      case 3:
      return "配送中";
      case 4:
      return "已完成";
    }
  }
  
})