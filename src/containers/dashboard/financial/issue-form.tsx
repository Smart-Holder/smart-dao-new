import { useAppSelector } from '@/store/hooks';
import { getCookie } from '@/utils/cookie';
import { validateImage } from '@/utils/image';
import { validateChinese } from '@/utils/validator';
import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Space,
  Upload,
  Image,
  UploadProps,
  Row,
  Col,
  Button,
  InputNumber,
  Select,
  message,
  Modal,
} from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { FC, useEffect, useState } from 'react';
import styles from './issue-form.module.css';
import type { SelectProps } from 'antd';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { request } from '@/api';
import { safeMint } from '@/api/asset';
import { fromToken } from '@/utils';
import { useIntl } from 'react-intl';
import { isPermission } from '@/api/member';
import { Permissions } from '@/config/enum';
import { rng } from 'somes/rng';
import { createVote } from '@/api/vote';

const { Option } = Select;
type IssueFormProps = {};

const testTags = [
  { label: 'aaa', value: 'aaa' },
  { label: 'bbb', value: 'bbb' },
  { label: 'ccc', value: 'ccc' },
];

const IssueForm: FC<IssueFormProps> = () => {
  const { formatMessage } = useIntl();
  const { chainId, address, web3 } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [chainData, setChainData] = useState({ name: '' }) as any;

  const [tags, setTags] = useState<SelectProps['options']>([]);

  const [initialValues, setInitialValues] = useState() as any;

  useEffect(() => {
    if (ETH_CHAINS_INFO[chainId]) {
      setChainData(ETH_CHAINS_INFO[chainId]);
      setInitialValues({
        blockchain: ETH_CHAINS_INFO[chainId].name,
        supply: 1,
      });
    }
  }, []);

  const createProposal = async (values: any, _tokenURI: string) => {
    const params = {
      name: formatMessage({ id: 'proposal.financial.asset.publish' }),
      description: JSON.stringify({
        type: 'basic',
        purpose: `${formatMessage({
          id: 'proposal.financial.asset.publish',
        })}: ${values.name}`,
      }),
      extra: [
        {
          abi: 'asset',
          target: currentDAO.asset,
          method: 'safeMint',
          params: [
            currentDAO.first,
            '0x' + rng(32).toString('hex'),
            _tokenURI,
            web3.eth.abi.encodeParameters(
              ['address', 'uint256'],
              [address, '10000000000000000' /*min price 0.01 eth*/],
            ),
          ],
        },
      ],
    };

    // try {
    //   await createVote(params);
    //   message.success('success');
    // } catch (error) {
    //   console.error(error);
    // }

    return createVote(params);
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (!image) {
      setImageMessage('Image is required');
      return;
    }

    const params: any = {
      name: values.name,
      image,
      description: values.description,
      attributes: [
        { trait_type: 'supply', value: values.supply },
        { trait_type: 'blockchain', value: values.blockchain },
        { trait_type: 'symbol', value: chainData.symbol },
        // { trait_type: 'price', value: fromToken() },
        { trait_type: 'chainId', value: chainId },
        { trait_type: 'decimals', value: chainData.decimals },
        { trait_type: 'tags', value: values.tags.toString() },
      ],
    };

    if (values.label && values.value) {
      params.attributes.push({
        trait_type: values.label,
        value: values.value,
        ratio: values.ratio,
      });
    }

    console.log('params', params);
    setLoading(true);

    try {
      const _tokenURI = await request({
        name: 'utils',
        method: 'saveTokenURIInfo',
        params,
      });

      if (!_tokenURI) {
        setLoading(false);
        return;
      }

      if (!(await isPermission(Permissions.Action_Asset_SafeMint))) {
        await createProposal(params, _tokenURI);
        Modal.success({
          title: formatMessage({ id: 'proposal.create.message' }),
          className: 'modal-small',
        });
      } else {
        await safeMint({ _tokenURI });
        message.success('Success');
      }

      setLoading(false);
      form.resetFields();
      setImage('');
    } catch (error) {
      console.error(error);
      setLoading(false);
    }

    // if (image) {
    //   const params = {
    //     ...userInfo,
    //     image,
    //     nickname: values.nickname,
    //   };

    //   sdk.user.methods.setUser(params).then(() => {
    //     handleCancel();
    //     sdk.user.methods.getUser().then((res) => {
    //       if (res && res.nickname) {
    //         dispatch(setUserInfo(res));
    //       }
    //     });
    //   });
    // }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  const onImageChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === 'done') {
      setImage(process.env.NEXT_PUBLIC_QINIU_IMG_URL + info.file.response.key);
      setImageMessage('');
    }
  };

  const beforeUpload = (file: RcFile) => {
    const message = validateImage(file);
    return !message;
  };

  if (!initialValues) {
    return null;
  }

  return (
    <Form
      name="info"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      requiredMark={true}
      validateTrigger="onBlur"
      className={styles['container']}
    >
      <Form.Item
        name="name"
        label={formatMessage({ id: 'name' })}
        rules={[{ required: true }, { type: 'string', min: 1, max: 30 }]}
      >
        <Input className={styles['input']} placeholder="" />
      </Form.Item>
      <Form.Item
        name="tags"
        rules={[{ required: true }]}
        label={formatMessage({ id: 'financial.asset.tagname' })}
      >
        {/* <Row gutter={15}>
          <Col span={20}>
            <Input className={styles['input']} placeholder="Write here" />
          </Col>
          <Col span={4}>
            <Button type="primary" block className={styles['input-btn']}>
              Add
            </Button>
          </Col>
        </Row> */}
        <Select
          size="large"
          mode="tags"
          style={{ width: '100%' }}
          placeholder=""
          options={tags}
        />
      </Form.Item>
      <Form.Item
        name="description"
        rules={[{ type: 'string', max: 1000 }]}
        label="Introduction"
      >
        <Input.TextArea className={styles['input']} placeholder="" rows={4} />
      </Form.Item>
      <Form.Item
        valuePropName="fileList"
        label="Image"
        required
        extra={<span style={{ color: 'red' }}>{imageMessage}</span>}
      >
        <Space>
          <Upload
            action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
            data={{ token: getCookie('qiniuToken') }}
            showUploadList={false}
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={onImageChange}
          >
            {image ? (
              <Image
                className={styles['upload-img']}
                src={image}
                width={88}
                height={88}
                preview={false}
                alt="image"
              />
            ) : (
              <PlusOutlined />
            )}
          </Upload>

          <span className={styles['upload-desc']}>
            {formatMessage({ id: 'start.upload' })}
          </span>
        </Space>
      </Form.Item>
      <Space size={10} align="end">
        <Form.Item
          name="label"
          rules={[{ type: 'string', max: 20 }]}
          label="Attributes"
        >
          <Input
            className={styles['input']}
            prefix={<span style={{ color: '#000' }}>属性项:</span>}
          />
        </Form.Item>
        <Form.Item name="value" rules={[{ type: 'string', max: 20 }]}>
          <Input
            className={styles['input']}
            prefix={<span style={{ color: '#000' }}>属性值:</span>}
          />
        </Form.Item>
        <Form.Item
          name="ratio"
          rules={[
            {
              pattern: /^([1-9][0-9]?|100)$/,
              message: 'not a valid number',
            },
          ]}
        >
          <Input
            className={styles['input']}
            prefix={<span style={{ color: '#000' }}>特征比例:</span>}
          />
        </Form.Item>
      </Space>
      <Form.Item name="supply" label="Supply">
        <InputNumber className={styles['input-number']} min={0} disabled />
      </Form.Item>
      <Form.Item name="blockchain" label="Blockchain">
        <Select
          disabled
          className={styles['select']}
          options={[{ value: chainData.name, label: chainData.name }]}
        />
      </Form.Item>
      <Form.Item name="tax" label="Tax">
        <Row gutter={15}>
          <Col span={6}>发行税: {currentDAO.assetIssuanceTax / 100}%</Col>
          <Col span={6}>流通税: {currentDAO.assetCirculationTax / 100}%</Col>
        </Row>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className={styles['button']}
          loading={loading}
        >
          Issue
        </Button>
      </Form.Item>
    </Form>
  );
};

export default IssueForm;
