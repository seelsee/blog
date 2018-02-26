let submitComment = document.querySelector('#submitComment'),
    messageContent = document.querySelector('#messageContent'),
    contentId = document.querySelector('#contentId'),
    messageList = document.querySelector('#messageList');
    // pager = document.querySelector('.pager'),

    let prepage = 6; //每页几条
    let page = 1;//当前页
    var pages = 0; //varvar总页数
    let comments = [];
//提交评论
submitComment.addEventListener('click', () => {
   contentIdValue = htmlEncode(contentId.value)
  $.ajax({
    type: 'POST',
    url: '/api/comment/post',
    data: {
      contentid: contentIdValue,
      content: messageContent.value
    },
    dataType:'json',
    success: function(responseData) {
      // console.log(result);
      messageContent.value = '';
        comments = responseData.data.comments.reverse();

      renderComment();
    }
  })
});

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
  type: 'get',
  url: '/api/comment',
  data: {
    contentid: contentId.value,

  },
  success: function(responseData) {
    comments = responseData.data.reverse()
    renderComment();
  }
})

$('.pager').delegate('a', 'click', function() {
  if($(this).parent().hasClass('previous')) {
		 page--;
  } else {
    page++;
  }
	renderComment();

})


function renderComment() {
  $('#commentNum').html(comments.length)
  var pages = Math.max(Math.ceil( comments.length / prepage), 1);
  let start = Math.max(0, (page - 1) * prepage);
  let end = Math.min(start + prepage, comments.length);
  let $lis = $('.pager li');
  $lis.eq(1).html(page + '/' + pages);
  if (page <= 1) {
    page = 1;
    $lis.eq(0).html('<span>没有上一页了</span>');
  } else {
    $lis.eq(0).html('<a href="javascript:;">上一页</a>');
  }
  if (page >= pages) {
    page = pages;
    $lis.eq(2).html('<span>没有下一页了</span>');
  } else {
    $lis.eq(2).html('<a href="javascript:;">下一页</a>');
  }
  if (comments.length == 0) {
    messageList.innerHTML = '<div class="messageBox"><p>还没有评论</p></div>';
  } else {

    let html = '';

    for (let i = start; i < end; i++) {
      html += '<li><div><span class="fl">' + comments[i].username + '</span>' +
      '<span class="fr">' + TimeConversion(comments[i].postTime) + '</span></div>' +
      '<div>' + comments[i].content +
      '</div></li>';
    }
    messageList.innerHTML = html;
  }
  // console.log(messageList);
}

function TimeConversion(time) {
  let date1 = new Date(time);
  return date1.getFullYear() + '年' + (date1.getMonth() + 1) + '月' + date1.getDate() + '日' +
    date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
}
// 对用户的提交进行编码,简单处理XSS
function htmlEncode(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/ /g, '&nbsp;')
    .replace(/\'/g, '&#39;')
    .replace(/\"/g, '&quot;')
    .replace(/\n/g, '<br>');
}
