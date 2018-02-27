const express = require('express'),
      router = express.Router();
const Category = require('../models/Category'),
      Content = require('../models/Content');

let data;
//处理通用数据
router.use((req, res, next) => {
  data = {
    userInfo: req.userInfo,
    categories: [],
  }

  Category.find().then((categories) => {
    data.categories = categories;
    next();
  });
})
/* GET home page. */
router.get('/', (req, res, next) => {
  // console.log(req.userInfo);
     data.category = req.query.category || '';
     data.count = 0;
     data.page = Number(req.query.page || 1);
     data.limit = 10;
     data.pages = 0;
  let where = {};
  if ( data.category) {
    where.category = data.category
  }
  //读取所有的分类信息

  Content.where(where).count().then((count) => {
    data.count = count;
    data.pages =Math.ceil(data.count / data.limit);
    //页码不能超过总页数
    data.page = Math.min(data.page, data.pages);
    //页码不能小于1
    data.page = Math.max(data.page, 1);

    let skip = (data.page - 1) * data.limit; //忽略条数

    return Content.where(where).find().limit(data.limit).skip(skip).populate(['category', 'user']).sort({
      addTime: -1
    });
  }).then((contents) => {
    data.contents = contents;
    // console.log(contents);
    // console.log(data.contents);
    res.render('main/index', data);
  })
});

router.get('/view', (req, res) => {
  let contentId = req.query.contentid || '';
  Content.findOne({
    _id: contentId
  }).then((content) => {
    data.content = content;
    // console.log(data.content);
    content.views ++;
    content.save();
    res.render('main/view', data)
  })
});

module.exports = router;
