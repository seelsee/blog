let express = require('express');
    router = express.Router();
let User = require('../models/User');
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


module.exports = router;
