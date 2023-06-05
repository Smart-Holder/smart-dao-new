import { useEffect, useState } from 'react';
import { Image, Upload } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { useIntl } from 'react-intl';

import { getCookie, setCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';

import { request } from '@/api';

const App = (props: any) => {
  const { value, type, ...rest } = props;

  const { formatMessage } = useIntl();

  const [token, setToken] = useState();
  const [qiniuImgUrl, setQiniuImgUrl] = useState<string>();
  const [upLoadUrl, setUploadUrl] = useState<string>();

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
    const message = validateImage(file);

    return !message;
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
        data={{ token }}
        showUploadList={false}
        beforeUpload={beforeUpload}
        // listType="picture-card"
        // onChange={handleChange}
        {...rest}
      >
        {value ? (
          <Image
            className="upload-image"
            src={value}
            preview={false}
            alt="image"
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
