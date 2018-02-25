//模型类
let mongoose = require('mongoose'),
    contentsSchema = require('../schemas/contents');
module.exports = mongoose.model('Content', contentsSchema);
