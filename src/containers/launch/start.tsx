import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Form, Input, Tag, Space, Image, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

import Upload from '@/components/form/upload';
import Modal from '@/components/modal';

import { validateChinese, validateEthAddress } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { hexRandomNumber } from '@/utils';
import { validateImage } from '@/utils/image';
import { setMakeDAOStorage, getMakeDAOStorage } from '@/utils/launch';
import { useAppSelector } from '@/store/hooks';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import iconSuccess from '/public/images/icon-success.png';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const App: React.FC = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { nickname, image, description } = useAppSelector(
    (store) => store.user.userInfo,
  );

  // const [cacheDAO, setCacheDAO] = useState({}) as any;
  const [members, setMembers] = useState([
    {
      id: hexRandomNumber(),
      name: nickname,
      description,
      image,
      votes: 1,
      owner: address,
    },
  ]);
  const [logo, setLogo] = useState('');
  const [poster, setPoster] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageMessage1, setImageMessage1] = useState('');
  const [imageMessage2, setImageMessage2] = useState('');

  const [form] = Form.useForm();

  useEffect(() => {
    const dao = getMakeDAOStorage('start');

    if (dao) {
      // setCacheDAO(dao);
      form.setFieldsValue({
        name: dao.name,
        mission: dao.mission,
        description: dao.description,
      });
      setMembers(dao.members);
      setLogo(dao.image);
      setPoster(dao?.extend?.poster || '');
    } else {
      form.resetFields();
      setMembers([
        {
          id: hexRandomNumber(),
          name: nickname,
          description,
          image,
          votes: 1,
          owner: address,
        },
      ]);
      setLogo('');
      setPoster('');
    }
  }, [chainId, address]);

  const onFinish = (values: any) => {
    if (!logo) {
      setImageMessage1('Image is required');
      document.querySelector('.logo-has-error')?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      return;
    }

    if (!poster) {
      setImageMessage2('Image is required');
      document.querySelector('.poster-has-error')?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      return;
    }

    const params = {
      chain: chainId,
      address: address,
      // operator: address,
      // web3: web3,
      memberBaseName: values.name + '-NFTP',
      ...values,
      members,
      image: logo,
      extend: { poster },

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

    document.querySelector('.ant-form-item-has-error')?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  };

  const removeMember = (value: string) => {
    members.splice(
      members.findIndex((item: any) => item.owner === value),
      1,
    );
    setMembers([...members]);
  };

  const addMember = () => {
    const { name, description, image, member } = form.getFieldsValue([
      'name',
      'description',
      'image',
      'member',
    ]);

    form
      .validateFields(['member'])
      .then(() => {
        const newMembers = [
          ...members,
          {
            id: hexRandomNumber(),
            name,
            description,
            image,
            votes: 1,
            owner: member,
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

  const onImageChange1: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }

    if (info.file.status === 'done') {
      setLogo(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setImageMessage1('');
    }
  };

  const onImageChange2: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }

    if (info.file.status === 'done') {
      setPoster(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setImageMessage2('');
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const next = () => {
    router.push('/launch/setting');
  };

  return (
    <div className="card" style={{ margin: '24px 0 50px' }}>
      <Form
        className="form"
        name="basic"
        form={form}
        wrapperCol={{ span: 17 }}
        // initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        validateTrigger="onBlur"
        // scrollToFirstError={true}
      >
        <div className="h1">{formatMessage({ id: 'start.basic' })}</div>
        <div className="h2">{formatMessage({ id: 'start.desc' })}</div>

        <Form.Item
          name="name"
          style={{ marginTop: 40 }}
          label={formatMessage({ id: 'start.name' })}
          rules={[
            { required: true },
            { type: 'string', min: 5, max: 12 },
            { validator: validateChinese },
          ]}
        >
          <Input id="ii" />
        </Form.Item>

        <Form.Item
          name="mission"
          label={formatMessage({ id: 'start.mission' })}
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item
          name="description"
          label={formatMessage({ id: 'start.introduce' })}
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item
          label="Logo"
          valuePropName="fileList"
          required
          extra={
            <span className="logo-has-error" style={{ color: 'red' }}>
              {imageMessage1}
            </span>
          }
        >
          <Upload value={logo} onChange={onImageChange1} />
        </Form.Item>

        <Form.Item
          label="Poster"
          valuePropName="fileList"
          required
          extra={
            <span className="poster-has-error" style={{ color: 'red' }}>
              {imageMessage2}
            </span>
          }
        >
          <Upload type="rectangle" value={poster} onChange={onImageChange2} />
        </Form.Item>

        <div className="h1" style={{ marginTop: 56 }}>
          {formatMessage({ id: 'start.members' })}
        </div>
        <div className="h2">{formatMessage({ id: 'start.members.desc' })}</div>

        <Row gutter={27} align="bottom">
          <Col span={17}>
            <Form.Item
              name="member"
              style={{ marginTop: 40, flex: 1 }}
              label={formatMessage({ id: 'name' })}
              rules={[
                { validator: validateEthAddress },
                { validator: validateRepeat },
              ]}
              wrapperCol={{ span: 24 }}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Button
              className="button-form"
              style={{ marginBottom: 32 }}
              type="primary"
              onClick={addMember}
            >
              {formatMessage({ id: 'start.add' })}
            </Button>
          </Col>
        </Row>

        <Row gutter={[20, 20]}>
          <Col span={15}>
            <Tag key={address} className="tag">
              {address}
            </Tag>
          </Col>
          {members.slice(1).map((item: any) => (
            <Col span={15} key={item.owner}>
              <Tag
                closable
                onClose={(e) => {
                  e.preventDefault();
                  removeMember(item.owner);
                }}
                data-value={item.owner}
                className="tag"
              >
                {item.owner}
              </Tag>
            </Col>
          ))}
        </Row>

        <Form.Item style={{ marginTop: 100 }}>
          <Button className="button-submit" type="primary" htmlType="submit">
            {formatMessage({ id: 'start.release' })}
          </Button>
        </Form.Item>
      </Form>

      <Modal type="normal" open={isModalOpen} onCancel={handleCancel}>
        <div className="modal-content">
          <Image
            src="/images/modal/icon_dialog_scucess@2x.png"
            width={80}
            height={80}
            alt=""
            preview={false}
          />
          <div className="modal-content-text">
            {formatMessage({ id: 'start.success' })}
          </div>
          <div style={{ marginTop: 60 }}>
            <Button className="button-submit" type="primary" onClick={next}>
              {formatMessage({ id: 'start.determine' })}
            </Button>
          </div>
        </div>
      </Modal>

      <style jsx>
        {`
          .card :global(.tag) {
            display: flex;
            justify-content: space-between;
            height: 54px;
            width: 100%;
            padding: 0 14px;
            margin-bottom: 4px;
            margin-right: 0;
            font-size: 18px;
            font-family: var(--font-family-400);
            font-weight: 400;
            color: #000;
            line-height: 54px;
            background: #fafafa;
            border: none;
          }

          .modal-content-text {
            width: 300px;
            margin: 32px auto 0;
            font-size: 18px;
            font-family: var(--font-family-500);
            font-weight: 500;
            color: #000000;
            line-height: 21px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
