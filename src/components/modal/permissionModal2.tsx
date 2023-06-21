import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Row, Col } from 'antd';
import { Checkbox, Form } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { setCurrentMember } from '@/store/features/daoSlice';

import Modal from '@/components/modal';

import { Permissions } from '@/config/enum';

// import { createVote } from '@/api/vote';
import { setPermissions } from '@/api/member';
import { useIntl, FormattedMessage } from 'react-intl';
import { isRepeateArray } from '@/utils';
import { request } from '@/api';
import { Member } from '@/config/define';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

type Props = {
  callback?: () => void;
};

const App = ({ callback = () => {} }: Props, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { userInfo } = useAppSelector((store) => store.user);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});

  const [data, setData] = useState<Member>();

  useImperativeHandle(ref, () => ({
    show: (item: Member) => {
      setIsModalOpen(true);
      setData(item);
      setInitialValues({ permissions: item.permissions });
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeateArray(data?.permissions, values.permissions));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    if (!data) {
      return;
    }

    const add = [] as number[]; // 添加的权限
    const remove: any = [] as number[]; // 删除的权限

    values.permissions.forEach((v: any) => {
      if (!data.permissions.includes(v)) {
        add.push(v);
      }
    });

    data.permissions.forEach((v: any) => {
      if (!values.permissions.includes(v)) {
        remove.push(v);
      }
    });

    const PermissionMap: { [index: number]: string } = {
      0x22a25870: formatMessage({ id: 'my.information.rights.add' }),
      0xdc6b0b72: formatMessage({ id: 'my.information.rights.proposal' }),
      0x678ea396: formatMessage({ id: 'my.information.rights.vote' }),
      0x59baef2a: formatMessage({ id: 'my.information.rights.publish' }),
      0xd0a4ad96: formatMessage({ id: 'my.information.rights.basic' }),
    };

    try {
      setLoading(true);
      await setPermissions(
        data.tokenId,
        add,
        remove,
        values.permissions,
        PermissionMap,
        data.owner,
      );
      setLoading(false);
      handleCancel();

      callback();

      // Modal.success({
      //   title: formatMessage({ id: 'proposal.create.message' }),
      // });
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
          <Form.Item name="permissions">
            <Checkbox.Group
              className="checkbox-group"
              // defaultValue={currentMember.permissions || []}
            >
              <Row style={{ width: '100%' }} gutter={[0, 10]}>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_VotePool_Vote}>
                    {formatMessage({ id: 'my.information.rights.vote' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_VotePool_Create}>
                    {formatMessage({ id: 'my.information.rights.proposal' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_Member_Create}>
                    {formatMessage({ id: 'my.information.rights.add' })}
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox value={Permissions.Action_Asset_SafeMint}>
                    {formatMessage({ id: 'my.information.rights.publish' })}
                  </Checkbox>
                </Col>
                <Col span={16}>
                  <Checkbox value={Permissions.Action_DAO_Settings}>
                    {formatMessage({ id: 'my.information.rights.basic' })}
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item style={{ marginTop: 50, marginBottom: 0 }}>
            <Button
              className="button-submit"
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isEdit}
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
