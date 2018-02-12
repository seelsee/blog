/*
入口文件
*/
const port = 8000;//启动端口号
//创建app服务;
let express = require('express'),
    swig = require('swig'), //加载模版
    mongoose = require('mongoose'),//加载数据库
    bodyParser = require('body-parser'),//加载body-parser,处理post提交的数据
    Cookies = require('cookies')//加载cookies模块,保存登陆状态
let app = express();

//静态文件托管
app.use('/public', express.static(__dirname + '/public'));
//配置模版
//定义模版引擎
app.engine('html', swig.renderFile);
//设置模版文件存放目录
app.set('views','./views');
//注册模版引擎
app.set('view engine', 'html');
swig.setDefaults({cache: false});//取消模版缓存
// app.get('/', (req, res, next)=> {
//
//   res.render('index');//读取views目录下的文件
// })

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
    } catch (e) {} finally {}
  }
  next();
});


//划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));




//连接数据库
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if(err) {
    console.log('数据库链接失败');
  } else {
    console.log('数据库链接成功');
    //监听http请求,port 端口
    app.listen(port);
  }
});



console.log('starting on port ' + port);
