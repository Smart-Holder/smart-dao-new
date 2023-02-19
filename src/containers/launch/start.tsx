import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Upload,
  Tag,
  Space,
  Modal,
  Image as Img,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import { validateChinese, validateEthAddress } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { hexRandomNumber } from '@/utils';
import { validateImage, getBase64 } from '@/utils/image';
import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import iconSuccess from '/public/images/icon-success.png';
import { deployAssetSalesDAO } from '@/store/features/daoSlice';

const validateMessages = {
  required: '${label} is required!',
  string: {
    range: "'${label}' must be between ${min} and ${max} characters",
  },
};

const FormGroup: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const initialValues = getMakeDAOStorage('start') || {};

  const defaultMember = [
    {
      id: hexRandomNumber(),
      name: '',
      description: '',
      image: '',
      votes: 1,
      owner: address,
    },
  ];

  const [members, setMembers] = useState(
    initialValues.members || defaultMember,
  );

  const [avatar, setAvatar] = useState(initialValues.image);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { formatMessage } = useIntl();

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    const params = {
      chain: chainId,
      address: address,
      // operator: address,
      // web3: web3,
      memberBaseName: values.name + '-NFTP',
      ...values,
      members,
      image: avatar,

      // defaultVoteTime: 0,
      // assetIssuanceTax: 6000,
      // assetCirculationTax: 1000,
    };
    console.log('form:', params);

    setMakeDAOStorage('start', params);
    setIsModalOpen(true);

    // dispatch(deployAssetSalesDAO(params));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('form Failed:', errorInfo);
  };

  const removeMember = (value: string) => {
    members.splice(
      members.findIndex((item: any) => item.owner === value),
      1,
    );
    setMembers([...members]);
  };

  const addMember = () => {
    const value = form.getFieldValue('member');

    form
      .validateFields(['member'])
      .then(() => {
        const newMembers = [
          ...members,
          {
            id: hexRandomNumber(),
            name: '',
            description: '',
            image: '',
            votes: 1,
            owner: value,
          },
        ];

        setMembers(newMembers);
        form.setFieldValue('member', '');
      })
      .catch((errorInfo) => {});
  };

  const validateRepeat = (rule: any, value: string) => {
    if ((members || []).find((item: any) => item.owner === value)) {
      // callback(new Error(this.$t("rules.repeat", { name: "address" })));
      return Promise.reject(new Error('repeat'));
    }

    return Promise.resolve();
  };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }

    if (info.file.status === 'done') {
      setAvatar(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);

    return !message;
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const next = () => {
    router.push('/launch/setting');
  };

  return (
    <div className="form-wrap">
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <div className="wrap">
          {/* <Space size={0} wrap align="start" style={{ justifyContent: 'center' }}> */}
          <div className="item-group">
            <div className="form-title1">
              {formatMessage({ id: 'start.basic' })}
            </div>
            <div className="form-title2">
              {formatMessage({ id: 'start.desc' })}
            </div>
            <Form.Item
              label={formatMessage({ id: 'start.name' })}
              name="name"
              rules={[
                { required: true },
                { type: 'string', min: 5, max: 12 },
                { validator: validateChinese },
              ]}
            >
              <Input
              // className="input"
              // prefix={<span style={{ color: '#000' }}>Name:</span>}
              />
            </Form.Item>

            <Form.Item
              label={formatMessage({ id: 'start.mission' })}
              name="mission"
              rules={[
                { required: true },
                { type: 'string', min: 20, max: 150 },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label={formatMessage({ id: 'start.introduce' })}
              name="description"
              rules={[
                { required: true },
                { type: 'string', min: 20, max: 150 },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Logo" valuePropName="fileList">
              <Space>
                <Upload
                  action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
                  data={{ token: getCookie('qiniuToken') }}
                  showUploadList={false}
                  listType="picture-card"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {avatar ? (
                    <Img
                      style={{ borderRadius: 10, cursor: 'pointer' }}
                      src={avatar}
                      width={100}
                      height={100}
                      preview={false}
                      alt="image"
                    />
                  ) : (
                    <div>
                      <PlusOutlined />
                    </div>
                  )}
                </Upload>

                <span className="upload-desc">
                  {formatMessage({ id: 'start.upload' })}
                </span>
              </Space>
            </Form.Item>
          </div>

          <div className="item-group">
            <div className="form-title1">
              {formatMessage({ id: 'start.members' })}
            </div>
            <div className="form-title2">
              {formatMessage({ id: 'start.members.desc' })}
            </div>

            <Form.Item
              label={formatMessage({ id: 'name' })}
              name="member"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[
                { validator: validateEthAddress },
                { validator: validateRepeat },
              ]}
            >
              {/* <Input /> */}
              <Space
                className="input-member"
                align="baseline"
                direction="horizontal"
              >
                <Input />
                <Button type="primary" onClick={addMember}>
                  {formatMessage({ id: 'start.add' })}
                </Button>
              </Space>
            </Form.Item>

            <div className="tags">
              <Tag key={address} className="tag">
                {address}
              </Tag>
              {members.slice(1).map((item: any) => (
                <Tag
                  closable
                  onClose={(e) => {
                    e.preventDefault();
                    removeMember(item.owner);
                  }}
                  key={item.owner}
                  data-value={item.owner}
                  className="tag"
                >
                  {item.owner}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        <Form.Item>
          <Button className="button-submit" type="primary" htmlType="submit">
            {formatMessage({ id: 'start.release' })}
          </Button>
        </Form.Item>
      </Form>

      <Modal
        width={512}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="modal-content">
          <Image src={iconSuccess} width={88} height={88} alt="success" />
          <div style={{ marginTop: 55 }} className="modal-content-text">
            {formatMessage({ id: 'start.success' })}
          </div>
          {/* <div className="modal-content-text">Initialization successful!</div> */}
          <Button className="button-done" type="primary" onClick={next}>
            {formatMessage({ id: 'start.determine' })}
          </Button>
        </div>
      </Modal>

      <style jsx>
        {`
          .wrap {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .item-group {
            width: 48%;
            min-width: 460px;
          }

          .form-title1 {
            height: 30px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .form-title2 {
            height: 18px;
            margin-top: 7px;
            margin-bottom: 44px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap :global(.input) {
          }

          .upload-desc {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .tags {
            height: 300px;
            overflow-y: auto;
          }

          .wrap :global(.tag) {
            display: flex;
            justify-content: space-between;
            height: 54px;
            width: 100%;
            padding: 0 14px;
            margin-bottom: 4px;
            margin-right: 0;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 54px;
            background: #f9faff;
            border: none;
          }

          .wrap :global(.input-member) {
            width: 100%;
          }

          .wrap :global(.input-member .ant-space-item:first-child) {
            flex: 1;
          }

          .form-wrap :global(.button-submit) {
            width: 170px;
            height: 54px;
            font-size: 18px;
          }

          .modal-content {
            padding: 88px 0 77px;
            text-align: center;
          }

          .modal-content-text {
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 40px;
          }

          .modal-content :global(.button-done) {
            width: 169px;
            height: 54px;
            margin-top: 58px;
            font-size: 18px;
          }
        `}
      </style>
    </div>
  );
};

export default FormGroup;
