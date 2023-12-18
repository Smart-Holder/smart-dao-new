import type { RcFile } from 'antd/es/upload/interface';

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const validateImage = (file: RcFile) => {
  // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  // 临时放开所有限制条件 主要用来上传视频文件
  // if (!isJpgOrPng) {
  //   return 'You can only upload JPG/PNG file!';
  // }

  // 为了展示视频问题
  const isLt2M = file.size / 1024 / 1024 < 100;

  if (!isLt2M) {
    return 'Image must smaller than 2MB!';
  }

  return '';
};
