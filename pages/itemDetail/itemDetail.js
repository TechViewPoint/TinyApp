const urls = [

  'https://techviewpoint.github.io/journey/cdn/videos/test.mp4',
  
]

const videoList = urls.map((url, index) => ({ id: index + 1, url }))
const app = getApp();
Page({
  data: {
    videoList,
    item:null
  },
  onLoad()
  {
    console.log("detail", app.userInfoData.item);
    this.setData(
      {
        item: app.userInfoData.item
      })
  },

  onPlay(e) { },

  onPause(e) {
    //  console.log('pause', e.detail.activeId)
  },

  onEnded(e) { },

  onError(e) { },

  onWaiting(e) { },

  onTimeUpdate(e) { },

  onProgress(e) { },

  onLoadedMetaData(e) {
    console.log('LoadedMetaData', e)
  },

  handleBuy()
  {
    app.userInfoData.item = this.data.item;
    app.userInfoData.orderType = { orderName: app.userInfoData.item.title, typeCode: 2 };
    wx.navigateTo({
      url: '../info/info',
    })
  }

})