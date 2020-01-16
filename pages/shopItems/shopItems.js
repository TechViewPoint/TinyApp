
const app = getApp()
Page({
  data: {
    current_scroll:"tab1",
    categoriesKeys:[],
    categories:[
      ],
    items: [

    ],
    tabItemsData:[]
  },

  onLoad: function(options) {
    //this.selectTab("tab1")
    var that = this;
    var dataCache = wx.getStorageSync('StoreData');
    if(dataCache)
    {
      this.setData(
        {
          categoriesKeys: dataCache.categories.map(c => c.key),
          categories: dataCache.categories,
          items: dataCache.items
        })
      this.selectTab(this.data.categoriesKeys[0]);
    }
    wx.vrequest({
      url: 'https://techviewpoint.github.io/journey/cdn/StoreData.json', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        //console.log("json req",res.data)
        var data = JSON.parse(res.data);
        console.log("store data",data);
        wx.setStorageSync('StoreData', data);
        that.setData(
          {
            categoriesKeys:data.categories.map(c=>c.key),
            categories: data.categories,
            items:data.items
          })

        that.selectTab(that.data.categoriesKeys[0]);
      },
      fail(res)
      {
        console.log("get data fail", res);
      }
    })
  },
  handleChangeScroll({
    detail
  }) {
    console.log(detail);
    this.selectTab(detail.key)
  },

  selectTab(detail)
  {
    switch (detail)
    {
      case this.data.categoriesKeys[0]:
        this.setData({
          current_scroll: detail,
          tabItemsData: this.data.items[0]
        });
        break;
      case this.data.categoriesKeys[1]:
        this.setData({
          current_scroll: detail,
          tabItemsData: this.data.items[1]
        });
        break;
      case this.data.categoriesKeys[2]:
      console.log("select 3");
        this.setData({
          current_scroll: detail,
          tabItemsData: this.data.items[2]
        });
        break;
    }
  },

  handleItemClick(data)
  {
    console.log("handleItemClick",data);    
    app.userInfoData.item = data.currentTarget.dataset.item;

    wx.navigateTo({
      url: '../itemDetail/itemDetail'
    })
  }


})