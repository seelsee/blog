module.exports = function (str) {
  //简单处理XSS
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/ /g, '&nbsp;')
      .replace(/\'/g, '&#39;')
      .replace(/\"/g, '&quot;')
      .replace(/\n/g, '<br>');
}
