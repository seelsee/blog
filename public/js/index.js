console.log(1);
let register = document.querySelector('.register'),
    reuser = document.querySelector('#reuser'),
    repassword = document.querySelector('#password'),
    rerepassword = document.querySelector('#repassword');
console.log(repassword.value);
//注册
register.addEventListener('click', () => {
  $.ajax({
    type: 'post',
    url: '/api/user/register',
    data: {
      username: reuser.value,
      password: repassword.value,
      repassword: rerepassword.value,
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);//查看返回


    }
  })
    console.log(2);
})
