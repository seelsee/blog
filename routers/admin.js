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
        userInfo: req.userInfo
    });
})

router.get('/user', function (req, res, next) {

    /*
    从数据库中读取用户所有数据
     */


    let page = Number(req.query.page || 1);
    let limit = 10;//一页显示几条,可手动更改


    let pages=0;

    //获取总记录数
    User.count().then(function (count) {
        //总页数
        pages =Math.ceil(count / limit);
        //页码不能超过总页数
        page = Math.min(page, pages);
        //页码不能小于1
        page = Math.max(page, 1);

        let skip = (page - 1) * limit; //忽略条数

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user_index.html', {
                userInfo: req.userInfo,
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
  let page = Number(req.query.page || 1);
  let limit = 10;//一页显示几条,可手动更改


  let pages=0;

  //获取总记录数
  Category.count().then(function (count) {
      //总页数
      pages =Math.ceil(count / limit);
      //页码不能超过总页数
      page = Math.min(page, pages);
      //页码不能小于1
      page = Math.max(page, 1);

      let skip = (page - 1) * limit; //忽略条数

      Category.find().limit(limit).skip(skip).then(function (categories) {
          res.render('admin/category_index', {
              userInfo: req.userInfo,
              categories: categories,
              count: count,
              pages: pages,
              limit: limit,
              page: page
          });
      });
  })
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


//分类修改
router.get('/category/edit', (req, res) => {
  // 获取要修改的分类信息,并用表单展现出来
  let id = req.query.id || '';

  //数据库是否已经存在该分类
  Category.findOne({
    _id: id
  }).then((category) => {
    if(!category) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '不存在该分类'
      });
    } else {
      res.render('admin/category_edit', {
        userInfo: req.userInfo,
        category: category
      });
    }
  })
})

//分类的修改保存
router.post('/category/edit', (req, res) => {
  let id = req.query.id || '';
  let name = req.body.name || '';

  //获取要修改的分类信息
  Category.findOne({
    _id: id
  }).then((category) => {

    if(!category) {

      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '不存在该分类'
      });
      return new Promise.reject();
    } else {
      //当用户没有做任何的修改提交的时候
      if (name === category.name) {

        res.render('admin/success', {
          userInfo: req.userInfo,
          message: '修改成功!',
          url: '/admin/category'
        })
        return new Promise.reject();
      } else {
        //要修改的分类名称是否在数据库中存在
      return  Category.findOne({
          _id: {$ne: id},
          name: name
        })
      }

    }
  }).then((sameCategory) => {
    if (sameCategory) {
      res.render('admin/error', {
        userInfo: req.userInfo,
        message: '数据库中已经存在同名分类'
      });
      return new Promise.reject();
    } else {
       return Category.update({
        _id: id
      }, {
        name: name
      });
    }
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '修改成功',
      url: '/admin/category'
    });
  })

})


//分类删除
router.get('/category/delete', (req, res) => {
  let id = req.query.id || '';
  Category.remove({
    _id: id
  }).then(() => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '删除成功',
      url: '/admin/category'
    })
  })
})






module.exports = router;
