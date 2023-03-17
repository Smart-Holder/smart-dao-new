import { useState } from 'react';
import { Image, Upload } from 'antd';
import { useIntl } from 'react-intl';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { getCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';

const App = (props: any) => {
  const { value, ...rest } = props;

  const { formatMessage } = useIntl();

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  // const handleChange: UploadProps['onChange'] = (
  //   info: UploadChangeParam<UploadFile>,
  // ) => {
  //   if (info.file.status === 'done') {
  //     setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
  //   }

  //   onChange(info);
  // };

  return (
    <div className="wrap">
      <Upload
        className="upload"
        action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
        data={{ token: getCookie('qiniuToken') }}
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
            width="100%"
            height={220}
            preview={false}
            alt="image"
          />
        ) : (
          <div className="upload-box-rectangle">
            <Image
              src="/images/home/icon_home_add_dao.png"
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
          .wrap :global(.upload) {
            display: block;
          }

          .wrap :global(.upload .ant-upload) {
            display: block;
          }

          .wrap :global(.upload-image) {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 4px;
            cursor: pointer;
          }

          .wrap .upload-box-rectangle {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 220px;
            background: #fbfbfb;
            border-radius: 4px;
            border: 1px dashed rgba(0, 0, 0, 0.15);
          }

          .wrap .upload-box-square {
            width: 150px;
            height: 150px;
            border-radius: 4px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
