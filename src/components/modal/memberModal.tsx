import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input } from 'antd';
import { Form } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { validateEthAddress } from '@/utils/validator';
import { useIntl } from 'react-intl';
import Modal from '@/components/modal';
import { request } from '@/api';
import { hexRandomNumber } from '@/utils';
import { Member } from '@/config/enum';

type Props = {
  onSave: (values: Member, index: number) => {};
  members: Member[];
};

const App = ({ onSave, members }: Props, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [init, setInit] = useState<Member>();
  const [index, setIndex] = useState(-1);
  const [memberLoading, setMemberLoading] = useState(false);

  const { nickname, image, description } = useAppSelector(
    (store) => store.user.userInfo,
  );

  useImperativeHandle(ref, () => ({
    show: (values?: Member, index = -1) => {
      setIsModalOpen(true);
      setInit(values);
      setIndex(index);
    },
  }));

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);
    const { address, votes } = values;

    setMemberLoading(true);

    let params: Member;

    if (init) {
      params = {
        ...init,
        owner: address,
        votes: Number(votes),
      };
    } else {
      const memberDetail = await request({
        name: 'user',
        method: 'getUserFrom',
        params: { address },
      });

      params = {
        id: hexRandomNumber(),
        name: memberDetail?.nickname || nickname,
        description: memberDetail?.description || description,
        image: memberDetail?.image || image,
        owner: address,
        votes: Number(votes),
      };
    }

    onSave(params, index);

    setMemberLoading(false);
    hideModal();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  const validateRepeat = (rule: any, value: string) => {
    if (
      index === -1 &&
      (members || []).find(
        (item: any) => item.owner.toLowerCase() === value.toLowerCase(),
      )
    ) {
      return Promise.reject(new Error('Repeat'));
    }

    return Promise.resolve();
  };

  return (
    <Modal type="form" open={isModalOpen} onCancel={hideModal}>
      <div className="title">
        {formatMessage({ id: 'member.nftp.addNFTP' })}
      </div>

      <Form
        className="form"
        name="info"
        initialValues={{
          address: init?.owner || '',
          votes: init?.votes || 1,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
      >
        <Form.Item
          name="address"
          label={formatMessage({ id: 'address' })}
          rules={[
            { required: true },
            { validator: validateEthAddress },
            { validator: validateRepeat },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="votes"
          label={formatMessage({ id: 'member.nftp.copies' })}
          rules={[
            { required: true },
            {
              pattern: /^[1-9][0-9]*$/,
              message: 'votes is not a valid number',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={memberLoading}
          >
            {formatMessage({ id: 'add' })}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default forwardRef(App);
