/*
* 封装md5加密函数
* md5加密,md5可逆向破解,并不安全
*/
let crypto = require('crypto');
module.exports = function (pwd) {
    let md5 = crypto.createHash('md5');
    let password = md5.update(pwd).digest('base64');
    return password;
}
