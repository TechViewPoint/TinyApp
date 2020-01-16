//info.js
const {
  $Message
} = require('../../lib/iview/base/index');
const {
  $Toast
} = require('../../lib/iview/base/index');
const authorizer = require('../../utils/authorizer.js')

const app = getApp()
const DB = wx.cloud.database()
Page({
  modelVisible: false,
  data: {
    isBusy: false,
    submitActions: [{
        name: '确认无误',
        color: '#19be6b',
      },
      {
        name: '返回修改',
        color: '#2d8cf0'
      },

    ],
    commentInfo: '0/45',
    orderName: '',
    name: '',
    phoneNum: '',
    address: '',
    comment: '',
    postalCode: '',
    provinceName: '',
    cityName: '',
    countyName: '',
    nationalCode: '',
    detailInfo: '',
    totalPrice: 0,
    protectionChecked: false,
    disabled: false,
    onePicturePrice: 1,
    onePicProtectPrice: 1.5,
    printImagePrice: null,
    copy: 1.0,
    sum: 1.0,
    deliverPrice: 1,
    orderType: 0,
    info: "价格说明：照片打印统一6寸,0.5元/张,塑封照片1元/张",
    isOpenConfirtDialog: false
  },

  onLoad: function() {

    var that = this;
    //console.log("++", app.userInfoData.orderType.orderName);
    this.setData({
      orderType: app.userInfoData.orderType.typeCode,
      orderName: app.userInfoData.orderType.orderName
    })

    DB.collection("price").get({
      success: function(res) {

        var price = res.data[0];
        if (price) {
          that.setData({
            printImagePrice: price,
            info: price.info
          });
        }
        that.updatePrice();

      },
      fail(res) {
        console.log("get price fail", res);
      }
    });

    if (!app.userInfoData.name) {
      wx.chooseAddress({
        success(res) {
          console.log(res.userName)
          console.log(res.postalCode)
          console.log(res.provinceName)
          console.log(res.cityName)
          console.log(res.countyName)
          console.log(res.detailInfo)
          console.log(res.nationalCode)
          console.log(res.telNumber)
          app.userInfoData.name = res.userName;
          app.userInfoData.postalCode = res.postalCode;
          app.userInfoData.provinceName = res.provinceName;
          app.userInfoData.cityName = res.cityName;
          app.userInfoData.countyName = res.countyName;
          app.userInfoData.detailInfo = res.detailInfo;
          app.userInfoData.nationalCode = res.nationalCode;
          app.userInfoData.phoneNum = res.telNumber;

          that.setData({
            name: app.userInfoData.name,
            phoneNum: app.userInfoData.phoneNum,
            address: app.userInfoData.provinceName + app.userInfoData.cityName + app.userInfoData.countyName + app.userInfoData.detailInfo,
            detailInfo: app.userInfoData.detailInfo,
            postalCode: app.userInfoData.postalCode,
            cityName: app.userInfoData.cityName,
            nationalCode: app.userInfoData.nationalCode,
            provinceName: app.userInfoData.provinceName,
            countyName: app.userInfoData.countyName,
            sum: app.userInfoData.tasks ? app.userInfoData.tasks.length : 0,
          });
        }
      })
    } else {
      that.setData({

        name: app.userInfoData.name,
        phoneNum: app.userInfoData.phoneNum,
        address: app.userInfoData.provinceName + app.userInfoData.cityName + app.userInfoData.countyName + app.userInfoData.detailInfo,
        detailInfo: app.userInfoData.detailInfo,
        postalCode: app.userInfoData.postalCode,
        cityName: app.userInfoData.cityName,
        nationalCode: app.userInfoData.nationalCode,
        provinceName: app.userInfoData.provinceName,
        countyName: app.userInfoData.countyName,
        sum: app.userInfoData.tasks ? app.userInfoData.tasks.length : 0,
      });
    }
    //console.log(app.userInfoData);
  },

  chooseAddress() {


    var that = this;


    authorizer.authorize("scope.address", function(res) {
      console.log('success', res);
      wx.chooseAddress({
        success: function(res) {
          console.log('address ok', res)
          app.userInfoData.name = res.userName;
          app.userInfoData.postalCode = res.postalCode;
          app.userInfoData.provinceName = res.provinceName;
          app.userInfoData.cityName = res.cityName;
          app.userInfoData.countyName = res.countyName;
          app.userInfoData.detailInfo = res.detailInfo;
          app.userInfoData.nationalCode = res.nationalCode;
          app.userInfoData.phoneNum = res.telNumber;
          that.setData({
            name: app.userInfoData.name,
            phoneNum: app.userInfoData.phoneNum,
            address: app.userInfoData.provinceName + app.userInfoData.cityName + app.userInfoData.countyName + app.userInfoData.detailInfo,
            detailInfo: app.userInfoData.detailInfo,
            postalCode: app.userInfoData.postalCode,
            cityName: app.userInfoData.cityName,
            nationalCode: app.userInfoData.nationalCode,
            provinceName: app.userInfoData.provinceName,
            countyName: app.userInfoData.countyName,
          });

        }
      });
    }, function(err) {
      console.log('denyback', err);
    }, function(err) {
      console.log('deniedBack', err);
    });

  },

  updatePrice() {
    if (app.userInfoData.orderType.typeCode == 2) {
      this.setData({
        deliverPrice: app.userInfoData.item.deliverPrice,
        totalPrice: app.userInfoData.item.price + app.userInfoData.item.deliverPrice
      });

    } else if (app.userInfoData.orderType.typeCode == 1) {
      var price = this.data.sum * (this.data.protectionChecked ? this.data.printImagePrice.picPrice.picWithProtect : this.data.printImagePrice.picPrice.pic) * this.data.copy + this.data.printImagePrice.picPrice.deliver;
      this.setData({
        deliverPrice: this.data.printImagePrice.picPrice.deliver,
        totalPrice: price
      });
    }
  },

  handleCopyChange({
    detail
  }) {
    this.setData({
      copy: detail.value
    });
    this.updatePrice();
  },

  handleProtectionChange({
    detail = {}
  }) {
    this.setData({
      protectionChecked: detail.current
    });

    this.updatePrice();
  },

  submit() {
    if (!this.checkForm())
      return;

    if (this.data.isBusy) {
      console.log("submit is busy");
      wx.showToast({
        title: '提交中请稍后,若长时间无响应请检查网络连接',
        icon: 'loading',
        duration: 2500
      });
      return;
    }
    //this.setData({
    //  modelVisible: true
    //});
    this.openDialog();
  },

  getOrderObj4Submit() {
    if (this.data.orderType == 1) {
      var fileItems = [];
      console.log("tasks is right or not ", app.userInfoData.tasks);
      for (var i = 0; i < app.userInfoData.tasks.length; i++) {
        fileItems.unshift(app.userInfoData.tasks[i].cloudId);
      }
      var order = {
        name: this.data.name,
        items: fileItems,
        address: {
          cityName: this.data.cityName,
          provinceName: this.data.provinceName,
          countyName: this.data.countyName,
          detailInfo: this.data.detailInfo,
          nationalCode: this.data.nationalCode,
          postalCode: this.data.postalCode
        },
        orderName: this.data.orderName,
        orderType: this.data.orderType,
        userInfo: app.globalData.userInfo,
        userOpenId: app.userInfoData.openid,
        copy: this.data.copy,
        needProtection: this.data.protectionChecked,
        price: this.data.totalPrice,
        phoneNumber: this.data.phoneNum,
        state: "待处理",
        dateTime: Date.parse(new Date()),
        responseMsg: []
      }
      return order;
    } else if (this.data.orderType == 2) {
      var order = {
        name: this.data.name,
        address: {
          cityName: this.data.cityName,
          provinceName: this.data.provinceName,
          countyName: this.data.countyName,
          detailInfo: this.data.detailInfo,
          nationalCode: this.data.nationalCode,
          postalCode: this.data.postalCode
        },
        itemId: app.userInfoData.item.itemId,
        orderName: this.data.orderName,
        orderType: this.data.orderType,
        userInfo: app.globalData.userInfo,
        userOpenId: app.userInfoData.openid,
        price: this.data.totalPrice,
        phoneNumber: this.data.phoneNum,
        state: "待处理",
        dateTime: Date.parse(new Date()),
        responseMsg: []
      }
      return order;
    }
  },

  handleSubmitClick() {
    //const index = detail.index;

    this.data.isBusy = true;
    wx.setStorageSync('userInfoData', app.userInfoData);

    var order = this.getOrderObj4Submit();
    var that = this;
    wx.cloud.callFunction({
      name: "submitOrder",
      data: order,
      success: function(res) {
        that.data.isBusy = false;
        console.log("submit order call back ok", res);
        wx.reLaunch({
          url: '../orderSubmitSuccess/orderSubmitSuccess'
        })
      },
      fail: function(res) {
        that.data.isBusy = false;
        console.log("submit order call back fail", res);
        wx.reLaunch({
          url: '../orderSubmitFail/orderSubmitFail',
        })
      },
      complete: function(res) {
        console.log("submit order call back complete", res);
        that.data.isBusy = false;
      }

    })
    this.setData({
      modelVisible: false
    });
  },

  checkForm() {
    //console.log("add",this.data.address);
    if (this.isStringEmpty(this.data.address)) {
      $Toast({
        content: '检查地址填写完整'
      });
      return false;
    }
    //console.log("phone num", this.data.phoneNum.length);
    if (this.isStringEmpty(this.data.phoneNum)) {
      $Toast({
        content: '检查电话填写是否正确'
      });
      return false;
    }
    if (this.isStringEmpty(this.data.name)) {
      $Toast({
        content: '检查昵称填写完整'
      });
      return false;
    }
    return true;
  },

  bindBuildingPickerChange: function(i) {
    this.setData({
      buildingIndex: i.detail.value,
    })
    app.userInfoData.building = i.detail.value;
    //console.log(app.userInfoData);
    wx.setStorageSync('userInfoData', app.userInfoData);
  },

  bindUnitPickerChange: function(i) {

    this.setData({
      unitIndex: i.detail.value
    })
    app.userInfoData.unit = i.detail.value;
    wx.setStorageSync('userInfoData', app.userInfoData);
  },

  isStringEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  addressChanged({
    detail
  }) {

    this.setData({
      address: detail.value
    });
  },

  phoneNumberChanged({
    detail
  }) {
    console.log(detail);

    this.setData({
      phoneNum: detail.value
    });
  },
  nickNameChanged({
    detail
  }) {

    this.setData({
      name: detail.value
    });
  },

  commentChanged({
    detail
  }) {
    this.setData({
      commentInfo: detail.value.length.toString() + "/45",
      comment: detail.value
    });
  },

  openDialog: function() {
    this.setData({
      isOpenConfirtDialog: true
    });
    //this.handleSubmitClick();
  },
  payIt:function()
  {
    this.setData({
      isOpenConfirtDialog: true
    });
    this.handleSubmitClick();
  },
  closeDialog: function() {
    this.setData({
      isOpenConfirtDialog: false
    })
  }
})