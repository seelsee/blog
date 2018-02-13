//模型类
let mongoose = require('mongoose');
let categoriesSchema = require('../schemas/categories');
module.exports = mongoose.model('Category', categoriesSchema);
