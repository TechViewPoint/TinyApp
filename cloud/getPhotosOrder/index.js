// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "royhuang-v6urk"
})

//const pricePhoto6size = 1.0
//const pricePhoto6size = 1.5
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var num = event.num;
  var size = event.size;
  
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}