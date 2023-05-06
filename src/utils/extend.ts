/**
 * DAO 扩展数据
 */

import buffer from 'somes/buffer';

export const formatToObj = (data: any) => {
  if (!data) {
    return {};
  }

  const jsonStr = buffer.from(data).toString();

  try {
    const res = JSON.parse(jsonStr);

    if (typeof res === 'string') {
      return { poster: res };
    } else if (typeof res === 'object') {
      return res;
    }
  } catch (error) {
    return {};
  }
};

export const formatToBytes = (data: object) => {
  if (!data) {
    return '';
  }

  return '0x' + buffer.from(JSON.stringify(data)).toString('hex');
};

export const formatToBbjExtend = (data: any) => {
  if (!data) {
    return {};
  }

  try {
    const buffer = Buffer.from(data.slice(2), 'hex');
    return JSON.parse(buffer.toString('utf8'));
  } catch (error) {
    return {};
  }
};
