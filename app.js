const express = require('express'),
      setting = require('./config/setting.js'),
      mongoose = require('mongoose');

//连接数据库
mongoose.connect(setting.dburl, (err) => {
  if(err) {
    console.log('unable to connect to database');
    } else {
    console.log('数据库链接成功');
  }
});

const app = express();

module.exports = require('./express')(app);

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(setting.port, () => {
  console.log('listening on port ' + setting.port);
});
