let express = require('express');
    router = express.Router();
router.get('/', (req, res, next) => {
  // console.log(req.userInfo._id);
  console.log(req.userInfo);
  res.render('main/index', {
    userInfo: req.userInfo
  });
});

module.exports = router;
