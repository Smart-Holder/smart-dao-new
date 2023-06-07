import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Button, Input } from 'antd';
import { Form } from 'antd';
import { useIntl } from 'react-intl';

import Modal from '@/components/modal';

import { addVotesOfBatch } from '@/api/member';
import { Member } from '@/config/define';

type Props = {
  callback?: () => void;
};

const App = ({ callback = () => {} }: Props, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ votes: 1 });

  const [data, setData] = useState<Member[]>([]);

  useImperativeHandle(ref, () => ({
    show: (items: Member[]) => {
      console.log(items, 'items');
      setIsModalOpen(true);
      setData(items);
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
    // setIsEdit(false);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    // setIsEdit(!isRepeateArray(data?.permissions, values.permissions));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);
    const value = Number(values.votes);

    const ids: string[] = [];
    const votes: number[] = [];
    const extraData: any = [];

    data.forEach((item) => {
      ids.push(item.tokenId);
      let num = value - Number(item.votes);
      votes.push(num);
      extraData.push({
        tokenId: item.tokenId,
        name: item.name,
        owner: item.owner,
        formerVotes: item.votes,
        votes: num,
      });
    });

    try {
      setLoading(true);
      await addVotesOfBatch([ids, votes], extraData);
      setLoading(false);
      handleCancel();

      callback();
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  return (
    <>
      <Modal type="form" open={isModalOpen} onCancel={handleCancel}>
        <div className="title">
          {formatMessage({ id: 'my.information.rights' })}
        </div>

        <Form
          className="form"
          name="info"
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
          {/* <Form.Item name="permissions" label="权限设置"> */}
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
              loading={loading}
              // disabled={!isEdit}
            >
              {formatMessage({ id: 'my.information.change' })}
            </Button>
          </Form.Item>
        </Form>

        <style jsx>{``}</style>
      </Modal>
    </>
  );
};

export default forwardRef(App);
