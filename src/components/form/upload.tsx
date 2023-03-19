import { Image, Upload } from 'antd';
import { useIntl } from 'react-intl';

import type { RcFile } from 'antd/es/upload/interface';

import { getCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';

const App = (props: any) => {
  const { value, type, ...rest } = props;

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
        className={type === 'rectangle' ? 'upload-rectangle' : ''}
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
            preview={false}
            alt="image"
          />
        ) : (
          <div className="upload-box">
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
            font-family: PingFangSC-Semibold, PingFang SC;
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
