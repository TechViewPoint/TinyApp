// 云函数入口文件
///const cloud = require('wx-server-sdk')

//cloud.init({
//  env: "royhuang-v6urk"
//})

// 云函数入口函数
const request = require('request');
exports.main = (evt, ctx) => {
  return new Promise((RES, REJ) => {
    request(evt.options, (err, res, body) => {
      if (err) return REJ(err);
      RES(res);
    })
  });
}