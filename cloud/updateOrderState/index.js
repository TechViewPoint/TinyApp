// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "royhuang-v6urk"
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  var res = await db.collection('order').doc(event.id).update(
    {
      data: { state: event.state},
      success: function (res) {
        console.log("call cloud fun update ok", res);
        return res;

      },
      fail: (res => {
        console.log("call cloud fun update fail", res);
        return res;
      })
    });
    return res;
   
    
   
}