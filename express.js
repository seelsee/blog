
const express = require('express'),
      swig = require('swig'), //加载模版
      bodyParser = require('body-parser'),//加载body-parser,处理post提交的数据
      Cookies = require('cookies'),//加载cookies模块,保存登陆状态
      User = require('./models/User');

module.exports = (app) => {

  //静态文件托管
  app.use('/public', express.static(__dirname + '/public'));
  //配置模版
  // view engine setup
  //定义模版引擎
  app.engine('html', swig.renderFile);
  //设置模版文件存放目录
  app.set('views','./views');
  //注册模版引擎
  app.set('view engine', 'html');
  swig.setDefaults({cache: false});//取消模版缓存

  //body-parser设置
  app.use(bodyParser.urlencoded({extended: true}))
  //设置cookie
  app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    req.userInfo = {};
    // console.log(req.userInfo);
    // console.log(typeof req.cookies.get('userInfo'));
    //解析登陆用户的cookie信息
    if (req.cookies.get('userInfo')) {
      try {
        req.userInfo = JSON.parse(req.cookies.get('userInfo'));
        //获取当前登录用户类型,是否是管理员
        User.findById(req.userInfo._id).then((userInfo) => {
          req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
          next();
        })
      } catch (e) {
        next();
      } finally {}
    } else {
      next();
    }
  });

  //划分模块
  app.use('/admin', require('./routers/admin'));
  app.use('/api', require('./routers/api'));
  app.use('/', require('./routers/main'));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  //error handler
  app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.html');
  });


return app;
}
