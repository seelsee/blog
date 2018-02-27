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
    reWarning = document.querySelector('.reWarning'),
    userInfo = document.querySelector('#userInfo'),
    username = document.querySelector('.username'),
    info = document.querySelector('.info'),
    logout = document.querySelector('#logout');


    //有个bug,当登陆注册按钮获取不到的时候会报错.
if (nowIn !== null) {
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
    // console.log(upuser.value);
    $.ajax({
      type: 'post',
      url: '/api/user/login',
      data: {
        username: inuser.value,
        password: inpassword.value,
      },
      dataType: 'json',
      success: function (result) {
        // console.log(result);
        loginWarning.innerHTML = result.message;
        //登陆成功
        if (result.code == 0) {
          setTimeout(() => {
            // loginBox.style.display = 'none';
            // userInfo.style.display = 'block';
            window.location.reload();
            //显示用户信息
            // username.innerHTML = result.userInfo.username;
            // info.innerHTML = '你好欢迎光临我的博客!';
          }, 1000)
        }
      }
    })
  })
}
//退出
if (nowUp == null) {
  logout.addEventListener('click', _ => {
    $.ajax({
      url: '/api/user/logout',
      success: function(result) {
        if (!result.code) {
            window.location.reload();
        }
      }
    })
  })
}
