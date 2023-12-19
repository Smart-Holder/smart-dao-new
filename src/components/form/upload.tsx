import { useCallback, useEffect, useState } from 'react';
import { Image, Upload, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { useIntl } from 'react-intl';
import hash from 'somes/hash';

import { getCookie, setCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';

import { request } from '@/api';
import { imageView2Max } from '@/utils';

const App = (props: any) => {
  const { value, type, imgWidth, ...rest } = props;

  const { formatMessage } = useIntl();

  const [token, setToken] = useState();
  const [qiniuImgUrl, setQiniuImgUrl] = useState<string>();
  const [upLoadUrl, setUploadUrl] = useState<string>();
  const [keyName, setKeyName] = useState<string>();
  const [blobType, setBlobType] = useState<string>();

  // useEffect(() => {
  //   request({
  //     name: 'utils',
  //     method: 'qiniuToken',
  //     params: null,
  //   }).then((res) => {
  //     setToken(res);
  //   });
  // }, []);

  useEffect(() => {
    request({
      name: 'utils',
      method: 'qiniuConfig',
      params: null,
    }).then((qiniu) => {
      if (qiniu) {
        setToken(qiniu.token);
        setQiniuImgUrl(`${qiniu.prefix}/`);
        setUploadUrl(`https://${qiniu.config.cdnUpHosts[0]}/`);

        setCookie('qiniuToken', qiniu.token);
        setCookie('qiniuUploadUrl', `https://${qiniu.config.cdnUpHosts[0]}/`);
        setCookie('qiniuImgUrl', `${qiniu.prefix}/`);
      }
    });
  }, []);

  const beforeUpload = (file: RcFile) => {
    const msg = validateImage(file);
    const time = new Date().getTime();
    const fileName = file.name;

    setBlobType(file.type);
    let md5Str = hash.md5(file.name).toString('hex');
    const filename_suffix = '.' + fileName.split('.').pop();
    let name = `${md5Str}_${time}${filename_suffix}`;
    setKeyName(name);
    if (msg) {
      message.error(msg);
    }
    return !msg;
  };

  // const handleChange: UploadProps['onChange'] = (
  //   info: UploadChangeParam<UploadFile>,
  // ) => {
  //   if (info.file.status === 'error' && info.file.error.status === 401) {

  //   } else if (info.file.status === 'done') {
  //     onChange(info);
  //   }

  // };

  return (
    <div className="wrap">
      <Upload
        className={type === 'rectangle' ? 'upload-rectangle' : ''}
        action={upLoadUrl}
        // action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
        // data={{ token: getCookie('qiniuToken') }}
        data={{ token, key: keyName }}
        showUploadList={false}
        beforeUpload={beforeUpload}
        // listType="picture-card"
        // onChange={handleChange}
        {...rest}
      >
        {value && blobType?.startsWith('image/') ? (
          <Image
            className="upload-image"
            src={imageView2Max({
              url: value,
              w: imgWidth,
            })}
            preview={false}
            alt="image"
          />
        ) : value && blobType?.startsWith('video/') ? (
          <video
            autoPlay
            loop
            muted
            controls={false}
            className="upload-image"
            src={value}
          />
        ) : (
          <div className="upload-box">
            <Image
              src="/images/home/icon_home_add_dao_default@2x.png"
              width={20}
              height={20}
              preview={false}
              alt="image"
            />
            {formatMessage({ id: 'start.upload' })}
          </div>
        )}
      </Upload>

      <style jsx>
        {`
          .wrap :global(.ant-upload) {
            width: 150px;
            height: 150px;
          }

          .wrap :global(.upload-rectangle .ant-upload) {
            display: block;
            width: 100%;
            height: 220px;
          }

          .wrap .upload-box {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            font-size: 15px;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
            background: #fbfbfb;
            border-radius: 4px;
            border: 1px dashed rgba(0, 0, 0, 0.15);
            cursor: ${rest.disabled ? 'not-allowed' : 'pointer'};
          }

          .wrap :global(.ant-upload-select .ant-image) {
            width: 100%;
            height: 100%;
          }

          .wrap :global(.upload-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
            cursor: ${rest.disabled ? 'not-allowed' : 'pointer'};
          }
        `}
      </style>
    </div>
  );
};

export default App;
