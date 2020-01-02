//info.js
const { $Message } = require('../../lib/iview/base/index');
const { $Toast } = require('../../lib/iview/base/index');
const app = getApp()
const DB = wx.cloud.database()
Page({
  modelVisible:false,
  data: {
    submitActions: [
      {
        name: '确认无误',
        color: '#19be6b',
      },
      {
        name: '返回修改',
        color: '#2d8cf0'
      },
     
    ],
    buildingArray: ['1栋', '2栋', '3栋', '4栋'],
    unitArray: ['1单元', '2单元', '3单元', '4单元'],
    buildingIndex: 0,
    unitIndex: 0,
    name: '',
    phoneNum: '',
    address: '',
    comment: '',
    value5: '',
    value6: '',
    totalPrice: 0,
    protectionChecked: false,
    disabled: false,
    onePicturePrice:0.5,
    onePicProtectPrice:1.0,
    copy:1.0,
    sum:1.0,
    deliverPrice:1.5
  },
  
  onLoad: function () {

    var that = this;
    DB.collection("price").get(
      {
        success: function (res) {
         
          var price = res.data[0];
          if(price)
          {
            that.setData(
              {
                onePicturePrice:price.picPrice.pic,
                onePicProtectPrice: price.picPrice.picWithProtect,
                deliverPrice: price.picPrice.deliver
              });
          }
          that.updatePrice();
          
        },
        fail(res) {
          console.log("get price fail", res);
        }
      });
    
    this.setData({
      name: that.app.userInfoData.name ? that.app.userInfoData.name:"",
      phoneNum: that.app.userInfoData.phoneNum ? that.app.userInfoData.phoneNum:"",
      address: that.app.userInfoData.address ? that.app.userInfoData.address:"",
      unitIndex: app.userInfoData.unit,
      buildingIndex: app.userInfoData.building,
      sum: app.userInfoData.tasks ? app.userInfoData.tasks.length:0,
    });


    
    //console.log(app.userInfoData);

  },

  updatePrice()
  {
    var price = this.data.sum * (this.data.protectionChecked ? this.data.onePicProtectPrice : this.data.onePicturePrice) * this.data.copy + this.data.deliverPrice;
    this.setData({
      totalPrice: price
    });
  },

  handleCopyChange({ detail})
  {
    this.setData({
      copy: detail.value
    });
    this.updatePrice();
  },

  handleProtectionChange({ detail = {} }) {
    this.setData({
      protectionChecked: detail.current
    });
    
    this.updatePrice();
  },

  submit()
  {
    if (!this.checkForm())
      return;
    this.setData({
      modelVisible: true
    });
  },

  handleSubmitClick({ detail})
  {
    const index = detail.index;

    if (index === 0) {
      //ok go ahead
      //console.log(app.userInfoData);

      //save userinfo to local
      app.userInfoData.name = this.data.name;
      app.userInfoData.address = this.data.address;
      app.userInfoData.phoneNum = this.data.phoneNum;
      wx.setStorageSync('userInfoData', app.userInfoData);

      //add order
      var fileItems = [];
      for (var i = 0; i<app.userInfoData.tasks.length;i++)
      {
        fileItems.unshift(app.userInfoData.tasks[i].cloudId);
      }
      var order =
      {
        name: this.data.name,
        items: fileItems,
        address:
        {
          building: 1,
          unit: 1,
          city: "桂林",
          province: "广西",
          street: "世纪东路"
        },
        addressDetail: this.data.address,
        userOpenId: app.userInfoData.openid,
        copy: this.data.copy,
        needProtection: this.data.protectionChecked,
        price: this.data.totalPrice,
        phoneNumber: this.data.phoneNum,
        state: "待处理",
        dateTime: new Date()
      }
      DB.collection("order").add({
        data: order,
        success:function(res)
        {
          //send email for notification
          wx.cloud.callFunction(
            {
              name:"sendmail",
              data: order
            }).then(res => {
              wx.reLaunch({
                url: '../orderSubmitSuccess/orderSubmitSuccess',
              })
            }).catch(err => {
              
            });
        },
        fail:function(res)
        {
          wx.reLaunch({
            url: '../orderSubmitFail/orderSubmitFail',
          })
        }
      })
    } else if (index === 1) {
      //cancel
    }

    this.setData({
      modelVisible: false
    });
  },

  checkForm()
  {
    //console.log("add",this.data.address);
    if (this.isStringEmpty(this.data.address)) {
      $Toast({
        content: '检查地址填写完整'
      });
      return false;
    }
    //console.log("phone num", this.data.phoneNum.length);
    if (this.isStringEmpty(this.data.phoneNum) || this.data.phoneNum.length!=11) {
      $Toast({
        content: '检查电话填写是否正确'
      });
      return false;
    }
    if (this.isStringEmpty(this.data.name) )
    {
      $Toast({
        content: '检查昵称填写完整'
      });
      return false;
    }
    return true;
  },

  bindBuildingPickerChange: function (i) 
  {
    this.setData({
      buildingIndex: i.detail.value,
    })
    app.userInfoData.building = i.detail.value;
    //console.log(app.userInfoData);
    wx.setStorageSync('userInfoData', app.userInfoData);
  },

  bindUnitPickerChange: function (i) {
    
    this.setData({
      unitIndex: i.detail.value
    })
    app.userInfoData.unit = i.detail.value;
    wx.setStorageSync('userInfoData', app.userInfoData);
  },

  isStringEmpty(obj)
  {
    if (typeof obj == "undefined" || obj == null || obj == "") {
      return true;
    } else {
      return false;
    }
  },

  addressChanged({detail})
  {
    
    this.setData(
      {
        address:detail.detail.value
      });
  },
  phoneNumberChanged({ detail }) {
    
    this.setData(
      {
        phoneNum: detail.detail.value
      });
  },
  nickNameChanged({ detail }) {
    
    this.setData(
      {
        name: detail.detail.value
      });
  },
  commentChanged({ detail }) {

    this.setData(
      {
        comment: detail.detail.value
      });
  }
})


