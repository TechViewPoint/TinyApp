// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: "royhuang-v6urk"
})

const db = cloud.database()
const _ = db.command

const nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,               // SMTP 端口
  secure: true,            // 使用 SSL
  auth: {
    user: '1246799927@qq.com',   //发邮件邮箱
    pass: 'idlnsaydanosifie'        //此处不是qq密码是
  }
});

var mailOptions = {
  from: '1246799927@qq.com',   // 发件地址
  to: '1246799927@qq.com',    // 收件列表
  subject: '测试云函数',      // 标题
  text: '测试云函数'
};

exports.main = async (event, context) => {
  // handle user order
  console.log("cloud fun", event);
   var databaseRes = await db.collection('order').add({
    data: {
      name: event.name,
      items: event.items,
      address: event.address,
      addressDetail: event.addressDetail,
      userOpenId: event.userOpenId,
      copy: event.copy,
      needProtection: event.needProtection,
      state: event.state,
      dateTime: event.dateTime,
      responseMsg: event.responseMsg,
      price: event.price
    },
    success: function (res) {

    },
    fail: function (res) {

    }
  })
  mailOptions.text = JSON.stringify(event);
  const info = await transporter.sendMail(mailOptions);
  return [databaseRes,info];
}