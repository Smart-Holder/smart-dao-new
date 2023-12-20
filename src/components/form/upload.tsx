import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Image, Spin, Upload, message } from 'antd';
import type { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { useIntl } from 'react-intl';
import hash from 'somes/hash';

import { getCookie, setCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';

import { request } from '@/api';
import { imageView2Max } from '@/utils';

export type RefType = {
  fn: (val: boolean) => void;
};
type PropsType = any;

const App = forwardRef<RefType, PropsType>((props, ref) => {
  const { value, type, imgWidth, ...rest } = props;

  const { formatMessage } = useIntl();

  const [token, setToken] = useState();
  const [qiniuImgUrl, setQiniuImgUrl] = useState<string>();
  const [upLoadUrl, setUploadUrl] = useState<string>();
  const [keyName, setKeyName] = useState<string>();
  const [blobType, setBlobType] = useState<string>();
  const [fileany, setFileany] = useState<any>();
  const [spinning, setSpinning] = useState(false);
  const [fileError, setFileError] = useState(false);

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
    setFileError(false);
    const msg = validateImage(file);
    const time = new Date().getTime();
    const fileName = file.name;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFileany(reader.result);
    };

    setBlobType(file.type);
    let md5Str = hash.md5(file.name).toString('hex');
    const filename_suffix = '.' + fileName.split('.').pop();
    let name = `${md5Str}_${time}${filename_suffix}`;
    setKeyName(name);
    if (msg) {
      message.error(msg);
      setSpinning(false);
      setFileError(true);
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

  useImperativeHandle(ref, () => ({
    fn: (val: boolean) => {
      setSpinning(val);
    },
  }));

  return (
    <div className="wrap">
      <Spin spinning={spinning}>
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
          {value && !fileError && blobType?.startsWith('image/') ? (
            <Image
              className="upload-image"
              src={imageView2Max({
                url: value,
                w: imgWidth,
              })}
              preview={false}
              alt="image"
            />
          ) : value && !fileError && blobType?.startsWith('video/') ? (
            <video
              autoPlay
              loop
              muted
              controls={false}
              className="upload-image"
              src={fileany}
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
      </Spin>

      <style jsx>
        {`
          .wrap :global(.ant-upload) {
            width: 150px;
            height: 150px;
          }
          .wrap :global(.ant-spin-nested-loading) {
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
});
App.displayName = 'Upload';
export default App;
