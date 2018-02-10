let mongoose = require('moogoose');
//用户表结构
moule.exports = new mongoose.Schema({
  //用户名
  username: String,
  //密码
  password: String
})
