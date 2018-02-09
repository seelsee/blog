let port = 8000;//启动端口号
//创建app服务;
let express = require('express'),
    swig = require('swig'); //加载模版
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
app.get('/', (req, res, next)=> {

  res.render('index');//读取views目录下的文件
})
//划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
// app.use('/', require('./routers/main'));



//监听http请求,port 端口
app.listen(port);



console.log('starting on port ' + port);
