let express = require('express');
    router = express.Router();
let User = require('../models/User'),
    Category = require('../models/Category')
router.use((req, res, next) => {
  if (!req.userInfo.isAdmin) {
    //如果当前用户不是管理员
    res.send('禁止访问,你不是管理员!!!');
    return;
  }
  next();
})
router.get('/', function (req, res, next) {
    res.render('admin/index.html', {
        userinfo: req.userinfo
    });
})

router.get('/user', function (req, res, next) {

    /*
    从数据库中读取用户所有数据
     */


    var page = Number(req.query.page || 1);
    var limit = 10;//一页显示几条,可手动更改


    var pages=0;

    //获取总记录数
    User.count().then(function (count) {
        //总页数
        pages =Math.ceil(count / limit);
        //页码不能超过总页数
        page = Math.min(page, pages);
        //页码不能小于1
        page = Math.max(page, 1);

        var skip = (page - 1) * limit; //忽略条数

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index.html', {
                userinfo: req.userinfo,
                users: users,
                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });
    })
})
//分类首页
router.get('/category', (req, res) => {
  res.render('admin/category_index', {
    userInfo: req.userInfo
  });
});

//分类的添加
router.get('/category/add', (req, res) => {
  res.render('admin/category_add', {
    userInfo: req.userInfo
  })
})
//分类提交
router.post('/category/add', (req, res) => {
  // console.log(req.body);
  let name = req.body.name || '';
  if (name == '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '名称不能为空',

    })
    return;
  }
  //数据库中是否已经存在同名分类名称
  Category.findOne({
    name: name
  }).then((result) => {
    if (result) {
      //数据库中已经存在该分类
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '分类已经存在'
      })
      return Promise.reject();
    } else {
      //数据库中不存在该分类,保存
      return new Category({
        name: name
      }).save();
    }
  }).then((newCategory) => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '分类保存成功',
      url: '/admin/category'
    })
  })





});











module.exports = router;
