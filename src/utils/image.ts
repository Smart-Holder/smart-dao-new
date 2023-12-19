import type { RcFile } from 'antd/es/upload/interface';

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export const validateImage = (file: RcFile) => {
  const isJpgOrPng =
    file.type.startsWith('image/') || file.type.startsWith('video/');

  if (!isJpgOrPng) {
    // return 'You can only upload JPG/PNG file!';
    return 'You can only upload Image file!';
  }

  // 为了展示视频or大文件
  const isLt2M = file.size / 1024 / 1024 < 100;

  if (!isLt2M) {
    return 'Image must smaller than 100MB!';
  }

  return '';
};
