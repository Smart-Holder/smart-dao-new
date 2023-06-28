// import moment from "moment";
import dayjs from 'dayjs';
import { rng } from 'somes/rng';
import BigNumber from 'bignumber.js';
import store from '@/store';
import web3 from 'web3';
import { ETH_CHAINS_INFO } from '@/config/chains';

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

// export function splitString(str, len = 2) {
//   if (typeof str !== 'string') {
//     return str;
//   }
// }

export const isRepeateArray = (arr1, arr2) => {
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

export const isMac = () => {
  return /macintosh|mac os x/i.test(navigator.userAgent);
};

export const copyToClipboard = (text) => {
  if (!text) {
    return;
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    console.log('navigator.clipboard');
    navigator.clipboard.writeText(text);
  } else {
    console.log('document.execCommand');
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', text);
    input.select();

    if (document.execCommand('copy')) {
      document.execCommand('copy');
    }
    document.body.removeChild(input);
  }
};

export const vw = (pixels = 0) => {
  return pixels === 0 ? '0' : ((pixels / 375) * 100).toFixed(5) + 'vw';
};

const even = ['0', '2', '4', '6', '8', 'a', 'c', 'e'];

export const getEvenNumber = () => {
  let n = rng(32).toString('hex');

  if (even.includes(n.slice(-1))) {
    return '0x' + n;
  }

  return getEvenNumber();
};

export const getUnit = () => {
  const { chainId } = store.getState().wallet;

  return ETH_CHAINS_INFO[chainId]?.unit || '';
};

export const JsonToGqlStr = (options) => {
  let optionsStr = ``;
  if (options) {
    for (let key of Object.keys(options)) {
      if (key && (options[key] != undefined || options[key] != null)) {
        if (typeof options[key] === 'boolean') {
          optionsStr += `${key}:${options[key]},`;
        } else if (typeof options[key] === 'string') {
          optionsStr += `${key}:"${options[key]}",`;
        } else if (typeof options[key] === 'object') {
          optionsStr += `${key}: { ${JsonToGqlStr(options[key])} }`;
        }
      }
    }
  }
  return optionsStr;
};

export const tokenIdFormat = (text) =>
  web3.utils.padLeft(web3.utils.toHex(web3.utils.toBN(text)), 64);

export const getChain = (label) => {
  const { chainId } = store.getState().wallet;

  if (ETH_CHAINS_INFO[chainId]) {
    return ETH_CHAINS_INFO[chainId][label] || '';
  }

  return '';
};

// 大图优化
export const imageView2Max = ({ url, w, h = 0 }) => {
  return url + `?imageView2/2/w/${w}${h !== 0 ? '/h/' + h : ''}/interlace/1`;
};
// 小图自动优化
export const imageView2Min = (url) => {
  return url + '?imageslim';
};
