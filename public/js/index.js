let register = document.querySelector('.register'),
    upuser = document.querySelector('#upuser'),
    uppassword = document.querySelector('#password'),
    reuppassword = document.querySelector('#repassword'),
    inuser = document.querySelector('#inuser'),
    inpassword = document.querySelector('#inpassword'),
    login = document.querySelector('.login');
console.log(upuser.value);
//注册
register.addEventListener('click', () => {
  $.ajax({
    type: 'post',
    url: '/api/user/register',
    data: {
      username: upuser.value,
      password: uppassword.value,
      repassword: reuppassword.value,
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);//查看返回


    }
  })
})
//登陆
login.addEventListener('click', () => {
  console.log(upuser.value);
  $.ajax({
    type: 'post',
    url: '/api/user/login',
    data: {
      username: inuser.value,
      password: inpassword.value,
    },
    dataType: 'json',
    success: function (result) {
      console.log(result);
    }
  })
})
