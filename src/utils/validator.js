import Web3 from 'web3';
// import i18n from '@/plugins/i18n';

export const validateChinese = (rule, value) => {
  if (value && /[\u4e00-\u9fa5]/.test(value)) {
    // callback(new Error(i18n.t('rules.english')));
    return Promise.reject(new Error('Cannot input Chinese'));
  }
  return Promise.resolve();
};

export function validateEthAddress(rule, value) {
  if (value && !Web3.utils.isAddress(value)) {
    // callback(new Error(i18n.t('rules.ethAddress')));
    return Promise.reject(new Error('Incorrect ethAddress'));
  }

  return Promise.resolve();

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
