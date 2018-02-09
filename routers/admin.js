let express = require('express');
    router = express.Router();
router.get('/user', (req, res, next) => {
  res.send('admin-User');
})
module.exports = router;
