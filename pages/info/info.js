//info.js
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
    value7: '',
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
          console.log("price",res);
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
      
      unitIndex: app.userInfoData.unit,
      buildingIndex: app.userInfoData.building,

    });

    
    console.log(app.userInfoData);
  },

  updatePrice()
  {
    var price = this.data.sum * (this.data.protectionChecked ? this.data.onePicProtectPrice : this.data.onePicturePrice) * this.data.copy + this.data.deliverPrice;
    this.setData({
      value7: price
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
    this.setData({
      modelVisible: true
    });
  },

  handleSubmitClick({ detail})
  {
    const index = detail.index;

    if (index === 0) {
      //ok go ahead
      
    } else if (index === 1) {
      //cancel
    }

    this.setData({
      modelVisible: false
    });
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


