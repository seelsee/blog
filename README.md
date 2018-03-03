# blogs

##### 介绍

* 这是一个简单的 博客

* 用户名后台有判断是否为非法字符

* 用户密码由md5简单加密,由于md5可逆向破解,并不安全，但加密后可以简单防止sql注入

* 评论简单的处理XSS.

* 内容支持markdown语法，但回车换行匹配有问题.

##### Install

  自行安装好node环境和MongoDB数据库

  第一步: 安装依赖包

  * `npm install`

  第二步: 启动MongoDB数据库和数据库保存位置
  * `mongod --dbpath=*/blog/db --port=27017`
    第三步:
  * `node app.js`
    `localhost:8000`默认首页,管理员账号admin,密码admin.
##### 在线演示

  `http://45.77.86.234:8000/`
  mongodb远程设置不起,管理员账户有问题,进去不了.



 #### 目录结构

```
db  数据库存储目录
models 数据库模型文件目录和模块目录
node_modules 项目资源目录
public 静态资源目录
routers 路由目录
schemas 数据库结构文件目录
views 模版目录
app.js 入口文件
package.json 文件依赖配置包
README.md 项目说明文件
```
