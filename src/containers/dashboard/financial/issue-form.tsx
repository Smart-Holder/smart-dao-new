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
} from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import { FC, useState } from 'react';
import styles from './issue-form.module.css';

type IssueFormProps = {};

const IssueForm: FC<IssueFormProps> = () => {
  const [image, setImage] = useState();
  const [imageMessage, setImageMessage] = useState('');

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

  return (
    <Form
      name="info"
      //   onFinish={onFinish}
      //   onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      requiredMark={false}
      validateTrigger="onBlur"
      className={styles['container']}
    >
      <Form.Item
        name="name"
        rules={[
          { required: true },
          { type: 'string', min: 5, max: 12 },
          { validator: validateChinese },
        ]}
        label="Name"
      >
        <Input className={styles['input']} placeholder="Write here" />
      </Form.Item>
      <Form.Item
        name="tags"
        rules={[{ required: true }, { type: 'string', min: 5, max: 12 }]}
        label="Label"
      >
        <Row gutter={15}>
          <Col span={20}>
            <Input className={styles['input']} placeholder="Write here" />
          </Col>
          <Col span={4}>
            <Button type="primary" block className={styles['input-btn']}>
              Add
            </Button>
          </Col>
        </Row>
      </Form.Item>
      <Form.Item
        name="introduction"
        rules={[
          { required: true },
          { type: 'string', min: 5, max: 12 },
          { validator: validateChinese },
        ]}
        label="Introduction"
      >
        <Input.TextArea
          className={styles['input']}
          placeholder="Write here"
          rows={4}
        />
      </Form.Item>
      <Form.Item valuePropName="fileList" label="Origin Image">
        <Space>
          <Upload
            action={process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL}
            data={{ token: getCookie('qiniuToken') }}
            showUploadList={false}
            className={styles['upload-box']}
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
            Upload Images: png、jpeg…
          </span>
        </Space>
      </Form.Item>
      <Form.Item
        name="attributes"
        rules={[{ required: true }, { type: 'string', min: 5, max: 12 }]}
        label="Attributes"
      >
        <Row gutter={15}>
          <Col span={8}>
            <Input
              className={styles['input']}
              placeholder="Write here"
              prefix={<span style={{ color: '#000' }}>属性象:</span>}
            />
          </Col>
          <Col span={8}>
            <Input
              className={styles['input']}
              placeholder="Write here"
              prefix={<span style={{ color: '#000' }}>属性值:</span>}
            />
          </Col>
          <Col span={8}>
            <Input
              className={styles['input']}
              placeholder="Write here"
              prefix={<span style={{ color: '#000' }}>特征比例:</span>}
            />
          </Col>
        </Row>
      </Form.Item>
      <Form.Item name="supply" label="Supply">
        <InputNumber className={styles['input-number']} step={1} min={1} />
      </Form.Item>
      <Form.Item name="blockchain" label="Blockchain">
        <Select
          disabled
          defaultValue="Ethereum"
          className={styles['select']}
          options={[
            { value: 'Ethereum', label: 'Ethereum' },
            { value: 'Polygon', label: 'Polygon' },
            { value: 'BSC', label: 'BNB Smart Chain' },
          ]}
        />
      </Form.Item>
      <Form.Item name="tax" label="Tax">
        <Row gutter={15}>
          <Col span={6}>发行税：3%</Col>
          <Col span={6}>流通税：0.25%</Col>
        </Row>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className={styles['button']}>
          Issue
        </Button>
      </Form.Item>
    </Form>
  );
};

export default IssueForm;
