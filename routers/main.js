let express = require('express'),
    router = express.Router();
let Category = require('../models/Category'),
    Content = require('../models/Content')
router.get('/', (req, res, next) => {

  // console.log(req.userInfo);
  let data = {
    userInfo: req.userInfo,
    categories: [],
    count: 0,
    page: Number(req.query.page || 1),
    limit: 10,
    pages: 0,
  }


  //读取所有的分类信息

  Category.find().then((categories) => {


    data.categories = categories;
    return Content.count();

  }).then((count) => {

    data.count = count;
    data.pages =Math.ceil(data.count / data.limit);
    //页码不能超过总页数
    data.page = Math.min(data.page, data.pages);
    //页码不能小于1
    data.page = Math.max(data.page, 1);

    let skip = (data.page - 1) * data.limit; //忽略条数
    return Content.find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    });

  }).then((contents) => {
    data.contents = contents;
    // console.log(data);
    res.render('main/index', data);

  })



});

module.exports = router;
