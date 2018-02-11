let register = document.querySelector('.register'),
    upuser = document.querySelector('#upuser'),
    uppassword = document.querySelector('#password'),
    reuppassword = document.querySelector('#repassword'),
    inuser = document.querySelector('#inuser'),
    inpassword = document.querySelector('#inpassword'),
    login = document.querySelector('.login'),
    loginBox = document.querySelector('#loginBox'),
    registerBox = document.querySelector('#registerBox'),
    nowUp = document.querySelector('.nowUp'),
    nowIn = document.querySelector('.nowIn'),
    loginWarning = document.querySelector('.loginWarning'),
    reWarning = document.querySelector('.reWarning');
nowIn.addEventListener('click', _ => {
  loginBox.style.display = 'block';
  registerBox.style.display = 'none';

})
nowUp.addEventListener('click', _ => {
  loginBox.style.display = 'none';
  registerBox.style.display = 'block';

})
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
      reWarning.innerHTML = result.message;
      //注册成功
      if (result.code == 0) {
        setTimeout(() => {
          loginBox.style.display = 'block';
          registerBox.style.display = 'none';
        }, 1000)
      }

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
      //登陆成功
      if (result.code == 0) {
        setTimeout(() => {

        }, 1000)
      }
    }
  })
})
