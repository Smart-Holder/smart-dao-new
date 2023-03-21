import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Form,
  Input,
  Space,
  Modal,
  Image,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import buffer from 'somes/buffer';

import { validateChinese } from '@/utils/validator';
import { getCookie } from '@/utils/cookie';
import { isRepeate } from '@/utils';
import { validateImage } from '@/utils/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';

import { getDAO, getDAOList, setCurrentDAO } from '@/store/features/daoSlice';
import { setMissionAndDesc } from '@/api/dao';
import { Permissions } from '@/config/enum';
import { createVote } from '@/api/vote';
import { request } from '@/api';
import { useIntl } from 'react-intl';
import { isPermission } from '@/api/member';

import Upload from '@/components/form/upload';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const FormGroup: React.FC = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { chainId, address, web3 } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const { loading } = useAppSelector((store) => store.common);

  const [initialValues, setInitialValues] = useState() as any;
  const [isEdit, setIsEdit] = useState(false);

  // const extend = currentDAO?.extend
  //   ? JSON.parse(currentDAO.extend || '{}')
  //   : {};
  const extend = { poster: '' };

  console.log('extend', buffer.from(currentDAO.extend.data).toString());

  useEffect(() => {
    const getDAO = async () => {
      try {
        const res = await request({
          name: 'utils',
          method: 'getDAO',
          params: { chain: chainId, address: currentDAO.address },
        });

        if (res) {
          dispatch(setCurrentDAO(res));
          setInitialValues({
            name: res.name,
            mission: res.mission,
            description: res.description,
          });
          form.setFieldsValue({
            name: res.name,
            mission: res.mission,
            description: res.description,
          });
        }
      } catch (error) {}
    };

    getDAO();
  }, [chainId, address]);

  // const defaultMember = [
  //   {
  //     id: hexRandomNumber(),
  //     owner: getCookie('address'),
  //     votes: 1,
  //     name: '',
  //     description: '',
  //     logo: '',
  //   },
  // ];

  // const [members, setMembers] = useState(
  //   initialValues.members || defaultMember,
  // );

  const [logo, setLogo] = useState(currentDAO.image);
  const [poster, setPoster] = useState(extend?.poster);
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const setInfo = async (values: any) => {
    const params = {
      web3,
      address: address,
      host: currentDAO.host,
      ...values,
    };
    // console.log('form:', params);

    const res = await setMissionAndDesc(params);

    message.success('Success');
    console.log(res);

    dispatch(getDAOList({ chain: chainId, owner: address }));
    dispatch(getDAO({ chain: chainId, address: currentDAO.address }));
    setIsEdit(false);
  };

  const createProposal = async (values: any) => {
    const params = {
      name: formatMessage({ id: 'proposal.basic.basic' }),
      description: JSON.stringify({
        type: 'basic',
        purpose: `Vision & Mission: ${values.mission} Itroduction: ${values.description}`,
      }),
      extra: [
        {
          abi: 'dao',
          target: currentDAO.address,
          method: 'setMissionAndDesc',
          params: [values.mission, values.description],
        },
      ],
    };

    try {
      await createVote(params);
      Modal.success({
        title: formatMessage({ id: 'proposal.create.message' }),
        className: 'modal-small',
      });
      setIsEdit(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    // 没有权限，则创建提案
    if (!(await isPermission(Permissions.Action_DAO_Settings))) {
      // message.warning('没有权限');
      createProposal(values);
      return;
    }

    setInfo(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('form Failed:', errorInfo);
  };

  // const removeMember = (value: string) => {
  //   members.splice(
  //     members.findIndex((item: any) => item.owner === value),
  //     1,
  //   );
  //   setMembers([...members]);
  // };

  // const addMember = () => {
  //   const value = form.getFieldValue('member');

  //   form
  //     .validateFields(['member'])
  //     .then(() => {
  //       const newMembers = [
  //         ...members,
  //         {
  //           id: hexRandomNumber(),
  //           owner: value,
  //           votes: 1,
  //           name: '',
  //           description: '',
  //           logo: '',
  //         },
  //       ];

  //       setMembers(newMembers);
  //       form.setFieldValue('member', '');
  //     })
  //     .catch((errorInfo) => {});
  // };

  // const validateRepeat = (rule: any, value: string) => {
  //   if ((members || []).find((item: any) => item.owner === value)) {
  //     // callback(new Error(this.$t("rules.repeat", { name: "address" })));
  //     return Promise.reject(new Error('repeat'));
  //   }

  //   return Promise.resolve();
  // };

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }

    if (info.file.status === 'done') {
      setLogo(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setIsEdit(true);
    }
  };

  const handleChange2: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   return;
    // }

    if (info.file.status === 'done') {
      setPoster(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setIsEdit(true);
    }
  };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  // const next = () => {
  //   router.push('/launch/setting');
  // };

  if (!initialValues) {
    return null;
  }

  return (
    <div className="card">
      <Form
        className="form"
        name="basic"
        form={form}
        wrapperCol={{ span: 17 }}
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
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
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="mission"
          label={formatMessage({ id: 'start.mission' })}
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'start.introduce' })}
          name="description"
          rules={[{ required: true }, { type: 'string', min: 20, max: 150 }]}
        >
          <Input.TextArea rows={8} />
        </Form.Item>

        <Form.Item label="Logo" valuePropName="fileList">
          <Upload value={logo} onChange={handleChange} disabled />
        </Form.Item>

        <Form.Item label="Poster" valuePropName="fileList">
          <Upload
            type="rectangle"
            value={poster || logo}
            onChange={handleChange2}
            disabled
          />
        </Form.Item>

        {/* 
            <Form.Item
              label="Name"
              name="member"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              rules={[
                { validator: validateEthAddress },
                { validator: validateRepeat },
              ]}
            >
              <Space
                className="input-member"
                align="baseline"
                direction="horizontal"
              >
                <Input />
                <Button type="primary" onClick={addMember}>
                  Add
                </Button>
              </Space>
            </Form.Item>

            <div className="tags">
              {members.map((item: any) => (
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
          </div> */}

        <Form.Item style={{ marginTop: 100 }}>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isEdit}
          >
            {formatMessage({ id: 'save' })}
          </Button>
        </Form.Item>
      </Form>

      <style jsx>
        {`
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
