/* eslint-disable eqeqeq */
// JS操作cookies方法!

import cookie from 'somes/cookie_cli';

// 设置cookie
export function setCookie(cname, cvalue, exmins) {
  var d = new Date();
  d.setTime(d.getTime() + exmins * 24 * 3600 * 1000);
  cookie.set(cname, cvalue, d, '/');
}
// 读取cookie
export function getCookie(cname) {
  return cookie.get(cname) || '';
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
  cookie.remove(name);
}
