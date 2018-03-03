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
//前端样式

function getLength (str){
	return str.replace(/[^\x00-xff]/g,"xx").length;
}
function findStr(str,n){
	var tmp = 0;
	for (var i = 0; i < str.length; i++) {
		if (str.charAt(i)==n) {
			tmp++;
		}
	}
	return tmp;
}

//注册
let reUserMsg = document.querySelector('.reUserMsg'),
    count = document.querySelector('.count');
let name_length = 0;
console.log(reUserMsg);
upuser.onfocus = function() {
  reUserMsg.style.display = "block";
}
upuser.onkeyup = function (){
	count.style.visibility="visible";
	name_length=getLength(this.value);
	count.innerHTML = name_length+"个字符";
	if (name_length==0) {
		count.style.visibility="hidden";
	}
}
upuser.onblur = function() {
  //含有非法字符
	var re = /[^\w\u4e00-\u9fa5]/g;
	if (re.test(this.value)) {
		reUserMsg.innerHTML = '含有非法字符！';
	}
	//不能为空
	else if(this.value==""){
		reUserMsg.innerHTML = '不能为空！';
	}
	//长度超过25个字符
	else if (name_length>25){
		reUserMsg.innerHTML = '长度超过25个字符!';
	}
	//长度少于六个字符
	else if (name_length<6){
		reUserMsg.innerHTML = '长度少于6个字符!';
	}
	//OK
	else {
		reUserMsg.innerHTML = 'OK!';
	}
}
let rePwdMsg = document.querySelector('.rePwdMsg');
uppassword.onfocus = function () {
  rePwdMsg.style.display = "block";
	rePwdMsg.innerHTML = '6-16个字符，请使用字母加数字或符号的组合密码，不能单独使用字母、数字或符号。'
}
uppassword.onblur = function () {
  let m = findStr(uppassword.value,uppassword.value[0]);
	let re_n = /[^\d]/g;
	let re_t = /[^a-zA-Z]/g;
//不能为空
	if (this.value=="") {
		rePwdMsg.innerHTML = '密码不能为空！';
	}
//不能用相同字符
	else if (m==this.value.length){
		rePwdMsg.innerHTML = '不能用相同字符';
	}
//长度应为6-16个字符
	else if(this.value.length<6 || this.value.length>16){
		rePwdMsg.innerHTML = '长度应为6-16个字符';
	}
//不能全为数字
	else if (!re_n.test(this.value)) {
		rePwdMsg.innerHTML = '不能全为数字';
	}
//不能全为字母
	else if (!re_t.test(this.value)) {
		rePwdMsg.innerHTML = '不能全为字母';
	}
//OK
	else{
		rePwdMsg.innerHTML = 'OK';
	}
}


let rePwdMsg2 = document.querySelector('.rePwdMsg2');
reuppassword.onblur = function() {
  if(this.value != uppassword.value){
		rePwdMsg2.innerHTML = '两次输入的密码不一致';

	}
	else{
		rePwdMsg2.innerHTML = 'OK';
	}
}



//登陆
let inUserMsg = document.querySelector('.inUserMsg'),
    inPwdMsg =  document.querySelector('.inPwdMsg');

//用户名
inuser.onblur = function () {
  //不能为空
if(this.value==""){
		inUserMsg.style.display = "block";
		inUserMsg.innerHTML = '请输入用户名呀！';
	}
	//OK
	else {
		inUserMsg.style.display = "none";
	}
}
//密码
inpassword.onblur = function () {
  //不能为空，长度应为6-16个字符
  	if (this.value=="" || this.value.length<6 || this.value.length>16) {
  		inPwdMsg.style.display = "block";
  		inPwdMsg.innerHTML = '密码位数不对';
  	}
  //OK
  	else{
  		inPwdMsg.style.display = "none";
  	}
}





//
