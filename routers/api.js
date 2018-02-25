let express = require('express');
    router = express.Router();
let User = require('../models/User'),
    Content = require('../models/Content');
//统一返回格式
let responseData;
router.use((req, res, next) => {
  responseData = {
    code: 0,
    message: ''
  }
  next();
})

    //用户注册
/*    注册逻辑,
    1.用户名不为空
    2.密码不为空
    3.两次输入密码一致
    用户是否注册
    */
router.post('/user/register', (req, res, next) => {
  let username = req.body.username,
      password = req.body.password,
      repassword = req.body.repassword;
      //用户名是否为空
      if(username == '') {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;

      }
      //密码不能为空
      if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
      }
      //两次密码一致
      if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
      }
      //用户名是否已经被注册,查询数据库
      //参考 http://mongoosejs.com/docs/api.html#Model
      User.findOne({
        username: username
      }).then(function(userInfo) {
        // console.log(userInfo);
        if(userInfo) {
          //数据库中有该记录
          responseData.code = 4;
          responseData.message = '用户名已经注册了'
          res.json(responseData);
          return;
        }
        //保存用户注册信息到数据库中
        let user = new User({
          username: username,
          password: password
        });
        return user.save();
      }).then(function(newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
      });
  // console.log(req.body);//测试是否接收到数据
});
//登陆路由
router.post('/user/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username == '' || password == '') {
    responseData.code = 1;
    responseData.message = '用户名或密码不能为空';
    res.json(responseData);
    return;
  }
  //查询数据库中相同用户名和密码,存在并一致
  User.findOne({
    username: username,
    password: password
  }).then(function(userInfo) {
    if (!userInfo) {
      responseData.code = 2;
      responseData.message = '用户名或者密码错误';
      res.json(responseData);
      return;
    }
    //用户名和密码正确
    responseData.message = '登陆成功';
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    //设置Cookies
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }));
    res.json(responseData);
    return;
  })

})
//退出
router.get('/user/logout', (req, res) => {
  req.cookies.set('userInfo' ,null);

  res.json(responseData);
})

//评论提交
router.post('/comment/post', (req, res) => {
  //内容id
  let contentId =  req.body.contentid || '';
  let postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  };
  //查询当前这篇内容的信息
  Content.findOne({
    _id: contentId
  }).then((content) => {
    content.comments.push(postData);
    return content.save();
  }).then((newContent) => {
    responseData.message = '评论成功'
    responseData.data = newContent;
    res.json(responseData);
  })

});








module.exports = router;





















module.exports = router;
