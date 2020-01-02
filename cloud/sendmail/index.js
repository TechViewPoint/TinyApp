// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init("royhuang")
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
// 云函数入口函数
exports.main = async (event, context) => {
  console.log("Start to sendemail")
  //开始发送邮件
  mailOptions.subject="test";
  console.log("event", event);
  console.log("info", event.order.addressDetail);
  mailOptions.text = event.order.addressDetail;
  const info = await transporter.sendMail(mailOptions);
  console.log('Message sent: ' + info.response);
  return info
  
}