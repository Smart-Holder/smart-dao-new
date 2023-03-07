/* eslint-disable eqeqeq */
// JS操作cookies方法!

// 设置cookie
export function setCookie(cname, cvalue, exmins) {
  var d = new Date();
  d.setTime(d.getTime() + exmins * 24 * 3600 * 1000);
  var expires = 'expires=' + d.toGMTString();

  if (document) {
    document.cookie =
      cname + '=' + cvalue + '; path=/; sameSite=Strict; ' + expires;
  }
}
// 读取cookie
export function getCookie(cname) {
  var name = cname + '=';

  if (typeof document !== 'undefined') {
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
  }

  return '';
}

// 检查cookie
export function checkCookie() {
  var username = getCookie('username');
  if (username != '') {
    alert('Welcome again ' + username);
  } else {
    username = prompt('Please enter your name:', '');
    if (username != '' && username != null) {
      setCookie('username', username, 365);
    }
  }
}

// 清除cookie
export function clearCookie(name) {
  setCookie(name, '', -1);
}
