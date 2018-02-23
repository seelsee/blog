let express = require('express');
    router = express.Router();
let Category = require('../models/Category')
router.get('/', (req, res, next) => {

  // console.log(req.userInfo);

  //读取所有的分类信息

  Category.find().then((categories) => {
    // console.log(result);

    res.render('main/index', {
      userInfo: req.userInfo,
      categories: categories
    });

  })



});

module.exports = router;
