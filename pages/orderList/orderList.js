// pages/orderlist/orderList.js

const DB = wx.cloud.database();
const app = getApp();
Page({

  data: {
    orders: [],
    WAITING:"待处理"
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
          console.log(res);
          //handleData(res.data);
          for (var i = 0; i < res.data.length;i++)
          {
            res.data[i].dateTimeStr = that.timestamp2String(res.data[i].dateTime);
            res.data[i].description = res.data[i].items.length.toString()+"个项目";
          }
          that.setData(
            {
              orders: res.data.reverse()
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
  },
  actionsTap({detail})
  {
    console.log(detail);
  },

  timestamp2String(timestamp)
  {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    var hours = (date.getHours()).toString();
    var mins = (date.getMinutes()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    if (mins.length == 1)
    {
      mins = "0" + mins;
    }
    var dateTime = year + "-" + month + "-" + day + " " + hours+":"+mins;
    return dateTime;
  },
  dateToString: function (date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length == 1) {
      month = "0" + month;
    }
    if (day.length == 1) {
      day = "0" + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
  },
  
})