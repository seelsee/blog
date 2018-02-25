//模型类
let mongoose = require('mongoose'),
    usersSchema = require('../schemas/users');
module.exports = mongoose.model('User', usersSchema);
