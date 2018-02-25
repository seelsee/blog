let submitComment = document.querySelector('#submitComment'),
    messageContent = document.querySelector('#messageContent'),
    contentId = document.querySelector('#contentId'),
    messageList = document.querySelector('#messageList');
//提交评论
submitComment.addEventListener('click', () => {
  $.ajax({
    type: 'POST',
    url: '/api/comment/post',
    data: {
      contentid: contentId.value,
      content: messageContent.value
    },
    success: function(responseData) {
      // console.log(result);
      messageContent.value = '';
      renderComment(responseData.data.comments.reverse());
    }
  })
})

function renderComment(comments) {
  let html = '';
  for (let i = 0; i < comments.length; i++) {
     html += '<li><div><span class="fl">' + comments[i].username + '</span>' +
                    '<span class="fr">' + comments[i].postTime + '</span></div>' +
                    '<div>' + comments[i].content +
          '</div></li>';
  }
   messageList.innerHTML = html;
  console.log(messageList);
}
