// import moment from "moment";
import dayjs from 'dayjs';
import { rng } from 'somes/rng';
import BigNumber from 'bignumber.js';

export function fromToken(number, precision = 18, decimal = 4) {
  if (typeof Number(number) === 'number') {
    const amount = new BigNumber(number)
      .shiftedBy(-precision)
      .decimalPlaces(decimal)
      .toFormat();
    if (amount === 'NaN') return 0;
    return Number(amount);
  } else {
    return 0;
  }
}

export function toToken(number, precision) {
  if (typeof Number(number) === 'number') {
    const amount = new BigNumber(number)
      .shiftedBy(precision)
      .toFormat()
      .replaceAll(',', '');
    if (amount === 'NaN') return '0';
    return amount;
  } else {
    return '0';
  }
}

// 防抖
export const debounce = (fn, time) => {
  let timer = null;

  return function () {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, arguments);
      // console.log('???????');
    }, time);
  };
};

/**
 * 格式化地址
 * @param {string} address
 * @param {number} bef 前面显示几位
 * @param {number} aft 后面显示几位
 */
export function formatAddress(address, bef = 3, aft = 4) {
  if (address) return address.substr(0, bef) + '...' + address.substr(-aft);
  else return '--';
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// 转换成毫秒
export function timeFormat(days = 0, hours = 0, minutes = 0) {
  return (
    days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000
  );
}

/**
 * 获取时间戳，参数为 dayjs 格式
 * @param {Array} time
 * @returns
 */
export function formatDayjsValue(time) {
  return dayjs(time).valueOf();
}

/**
 * 获取时间戳，参数为 dayjs 数组
 * @param {Array} time
 * @returns
 */
export function formatDayjsValues(time) {
  if (!time || !Array.isArray(time)) {
    return null;
  }

  const [time1, time2] = time;

  return [dayjs(time1).valueOf(), dayjs(time2).valueOf()];
}

// 256随机数 hex
export function hexRandomNumber() {
  return '0x' + rng(32).toString('hex');
}

export function formatTime(val) {
  // return moment(val).format("HH:mm:ss");
  return val;
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorage(key) {
  if (typeof sessionStorage !== 'undefined') {
    return JSON.parse(sessionStorage.getItem(key));
  }
}

export function setSessionStorage(key, value) {
  return sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * 刷新或关闭页面前，浏览器默认的弹窗提示
 * @param {*} e
 * @returns
 */
export function beforeUnload(e) {
  e.returnValue = 'loading';
  e.preventDefault();
  return 'loading';
}

/**
 * 禁止页面的 click 事件
 * @param {*} e
 */
export function stopClick(e) {
  e.stopPropagation();
  e.preventDefault();
}

// export function splitString(str, len = 2) {
//   if (typeof str !== 'string') {
//     return str;
//   }
// }

export const isRepeateArray = (arr1, arr2) => {
  console.log(arr1, arr2);

  if (!arr1 || !arr2) {
    return false;
  }

  if (arr1.length !== arr2.length) {
    return false;
  }

  const a1 = [...arr1].sort();
  const a2 = [...arr2].sort();

  for (let i = 0, l = a1.length; i < l; i++) {
    if (a1[i] !== a2[i]) {
      return false;
    }
  }

  return true;
};

export const isRepeate = (obj1, obj2) => {
  if (!obj1 || !obj2) {
    return false;
  }

  const keys = Object.keys(obj2);

  for (let i = 0, l = keys.length; i < l; i++) {
    if (obj1[keys[i]] !== obj2[keys[i]]) {
      return false;
    }
  }

  return true;
};

export const isRepeate2 = (obj1, obj2) => {
  if (!obj1 || !obj2) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let i = 0, l = keys1.length; i < l; i++) {
    if (obj1[keys1[i]] !== obj2[keys1[i]]) {
      return false;
    }
  }

  return true;
};
