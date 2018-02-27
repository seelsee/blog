const express = require('express');
      router = express.Router();
const User = require('../models/User'),
      Category = require('../models/Category'),
      Content = require('../models/Content');


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
      //id 1升序 id -1降序s
      Category.find().sort({ _id: -1}).limit(limit).skip(skip).then(function (categories) {
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

//内容首页
router.get('/content', (req, res) => {
  let page = Number(req.query.page || 1);
  const limit = 10;//一页显示几条,可手动更改
  let pages=0;
  //获取总记录数
  Content.count().then(function (count) {
      //总页数
      pages =Math.ceil(count / limit);
      //页码不能超过总页数
      page = Math.min(page, pages);
      //页码不能小于1
      page = Math.max(page, 1);
      let skip = (page - 1) * limit; //忽略条数
      //id 1升序 id -1降序s
      Content.find().sort({ _id: -1}).limit(limit).skip(skip).populate(['category', 'user']).sort({
        addTime: -1
      }).then((contents) => {
          res.render('admin/content', {
              userInfo: req.userInfo,
              contents: contents,
              count: count,
              pages: pages,
              limit: limit,
              page: page
          });
      });
  })
});

//内容添加
router.get('/content/add', (req, res) => {
  Category.find().sort({ _id: -1 }).then((categories) => {
    res.render('admin/content_add', {
      userInfo: req.userInfo,
      categories: categories
    })
  })
});

//内容保存
router.post('/content/add', (req, res) => {
  // console.log(req.body);
  if (req.body.title == '') {
    res.render('admin/error', {
      userInfo: req.userInfo,
      message: '内容标题不能为空'
    })
    return;
  }
  //保存到数据库
  new Content({
    category: req.body.category,
    title: req.body.title,
    user: req.userInfo._id.toString(),
    description: req.body.description,
    content: req.body.content

  }).save().then((result) => {
    res.render('admin/success', {
      userInfo: req.userInfo,
      message: '内容保存成功',
      url: '/admin/content'
    })
    return;
  })
})

//修改内容
router.get('/content/edit', (req, res) => {
  let contentId = req.query.id || '';

  Category.find().sort({_id: -1}).then((categories) => {
    Content.findOne({
      _id: contentId
    }).populate(['category', 'user']).then((content) => {
      if(!content) {
        res.render('admin/error', {
          userinfo: req.userinfo,
          message: '不存在该内容'
        });
      } else {
        res.render('admin/content_edit', {
          userinfo: req.userinfo,
          content: content,
          categories: categories
        });
      }
    })
  })
})

//保存内容
router.post('/content/edit', (res, req) => {
  let id = req.query.id || '';
  if (req.body.category == '') {
    res.render('admin/error', {
      userinfo: req.userinfo,
      message: '内容分类不能为空'
    });
    return;
  }
  if (req.body.title == '') {
    res.render('admin/error', {
      userinfo: req.userinfo,
      message: '内容标题不能为空'
    });
    return;
  }
  Content.update({
    _id: id
  }, {
    category: req.body.category,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content
  }).then(_ => {
    res.render('admin/success', {
      userinfo: req.userinfo,
      message: '内容更新成功',
      url: '/admin/content/edit?id=' + id
    });
  })
});

//内容删除
router.get('/content/delete', (req, res) => {
  let contentId = req.query.id || '';
  //数据库是否已经存在该内容
  Content.findOne({
    _id: contentId
  }).then((content) => {
    if(!content) {
      res.render('admin/error', {
        userinfo: req.userinfo,
        message: '不存在该内容'
      });
    } else {
      Content.remove({
        _id: contentId
      }).then(function () {
        res.render('admin/success', {
          userinfo: req.userinfo,
          message: '删除成功',
          url: '/admin/content'
        });
      })
    }
  })
})

module.exports = router;
