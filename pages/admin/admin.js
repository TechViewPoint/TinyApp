// pages/orderlist/orderList.js
const downloadPic = require('../../utils/downloadPic.js')
const DB = wx.cloud.database();
const app = getApp();
Page({

  data: {
    orders: [],
    states: ["待处理","待付款", "处理中", "配送中", "已完成"],
    stateIndex: 0,
    WAITING: "待处理",
    ONLINE: "ONLINE",
    DOWNLOADING: "DOWNLOADING",
    PROCESSING: "PROCESSING",
    FINISHED: "FINISHED",
    ERROR: "ERROR",
  },

  getStateIndex(state) {
    return this.data.states.indexOf(state);
  },

  onLoad: function (options) {
    this.updateOrderList();
  },

  updateOrderList() {
    var that = this;

    DB.collection('order').get({
      success: function (res) {
        console.log("admin ok",res);
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].dateTimeStr = that.timestamp2String(res.data[i].dateTime);
          res.data[i].description = res.data[i].orderName;
        }
        
        //handleData(res.data);

        console.log(res.data);
        
        for (var j = 0; j < res.data.length; j++) {
          var tasks = [];
          if (res.data[j].orderType == 1)
          {
            for (var k = 0; k < res.data[j].items.length; k++) {
              tasks.push({
                path: res.data[j].items[k],
                state: that.data.ONLINE,
              });
            }
          }
          res.data[j].stateIndex = that.getStateIndex(res.data[j].state);
          res.data[j].tasks = tasks;
          
        }
        console.log("here");
        that.setData({
          orders: res.data
        });

      },
    })

  },

  handleData(data) {

    for (i = 0; i < data.length; i++) {
      data[i].state = getOrderStateText(state);
    }
  },

  getOrderStateText(state) {
    switch (state) {
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

  previewImage: function (e) {
    console.log(e);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.currentTarget.dataset.task.map(t => {
        return t.path;
      })

    })
  },

  actionsTap(
    detail
  ) {
    console.log(detail);
  },

  timestamp2String(timestamp) {
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
    if (mins.length == 1) {
      mins = "0" + mins;
    }
    var dateTime = year + "-" + month + "-" + day + " " + hours + ":" + mins;
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

  downloadOrderItems(order) {
    

    downloadPic.downloadSaveFiles(
      {
        urls: order.currentTarget.dataset.order.tasks.map(t => {
          console.log("path", t.path);
          return t.path;
        }),
        success: function (res) {
          //console.info(res);
          wx.showToast({
            title: '下载成功',
            icon: 'success',
            duration: 1000
          });
        },
        fail: function (e) {
          console.info("下载失败");
        }
      });
    return;
    for (var i = 0; i < order.currentTarget.dataset.order.tasks.length; i++) {
      this.downloadItem(order.currentTarget.dataset.order.tasks[i]);
    }
    



  },
  downloadItem(task) {
    var that = this;
    task.state = this.DOWNLOADING;
    wx.cloud.downloadFile({
      fileID: task.path,
      success: res => {
        // get temp file path
        console.log(res.tempFilePath)
        task.state = that.PROCESSING;
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {

            task.state = that.FINISHED;
            console.log("download finished", res);
          },
          fail(res) {
            console.log("save file fail", res);
          }

        })
      },
      fail: err => {
        // handle error
      }
    })
  },

  downloadImages(order) {
    var that = this;
    wx.showModal({
      title: '下载',
      content: '下载确认',
      confirmText: "下载",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.downloadOrderItems(order);
        } else {
        }
      }
    });
  },

  deleteOrder(order) {
    console.log("delete order", order.currentTarget.dataset.order._id);
    var that = this;
    wx.showModal({
      title: '删除此订单',
      content: '删除确认',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          that.callDeleteOrder(order);

        } else {

        }
      }
    });

   
  },

  callDeleteOrder(order)
  {
    var that = this;
    wx.cloud.callFunction({
      name: "deleteOrder",
      data:
      {
        id: order.currentTarget.dataset.order._id
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        });
        that.updateOrderList();
      },
      fail: function (res) {
        wx.showToast({
          title: '删除失败',
          icon: 'warn',
          duration: 1000
        });
      }

    });
  },

  callPhone(e) {
    console.log("phone number", e);
    var number = e.currentTarget.dataset.phonenumber;
    if (number.length == 11)
    {
      wx.makePhoneCall({
        phoneNumber: number //仅为示例，并非真实的电话号码
      })
    }
    
  },

  bindOrderStateChange(e) {
    var that = this;
    console.log("change", e);
    /*DB.collection('order').doc(e.currentTarget.dataset.order._id).update(
      {
        data:
        {
          state: this.data.states[e.detail.value]         
        },
        success:function(res)
        {
          console.log("update state ok");
        },
        fail:function(res)
        {
          
          console.log("update state fail",res);
        }
      })
      return;*/
    wx.cloud.callFunction(
      {
        name: "updateOrderState",
        data:
        {
          //id:e.currentTarget.dataset.order._id,
          id: e.currentTarget.dataset.order._id,
          state: this.data.states[e.detail.value]
        },
        success: (res => {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          });
          console.log("update state ok");
          this.updateOrderList();
        }),
        fail: (res => {
          wx.showToast({
            title: '修改失败',
            icon: 'warn',
            duration: 1000
          });
          console.log("update state fail");
        })
      })


  }

})