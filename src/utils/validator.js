import Web3 from 'web3';
import i18n from '@/plugins/i18n';

export function validateChinese(rule, value, callback) {
  if (value && /[\u4e00-\u9fa5]/.test(value)) {
    // callback(new Error("2-12 characters are supported"));
    callback(new Error(i18n.t('rules.english')));
  } else {
    callback();
  }
}

export function validateEthAddress(rule, value, callback) {
  if (value && !Web3.utils.isAddress(value)) {
    callback(new Error(i18n.t('rules.ethAddress')));
    // callback();
  } else {
    callback();
  }

  // if (value && !/^0x[0-9a-fA-F]{40}$/.test(value)) {
  //   callback(new Error("Invalid Ethereum address"));
  // } else {
  //   callback();
  // }
}

// export function validateEthAddress(value) {
//   if (value && /^0x[0-9a-fA-F]{40}$/.test(value)) {
//     return true;
//   }

//   return false;
// }
