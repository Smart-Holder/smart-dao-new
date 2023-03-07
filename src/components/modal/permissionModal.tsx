import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Row, Col } from 'antd';
import { Checkbox, Form } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { Permissions } from '@/config/enum';

// import { createVote } from '@/api/vote';
import { setPermissions } from '@/api/member';
import { useIntl } from 'react-intl';
import { isRepeateArray } from '@/utils';

// const validateMessages = {
//   required: '${label} is required!',
//   string: {
//     range: "'${label}' must be between ${min} and ${max} characters",
//   },
// };

const App = (props: any, ref: any) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((store) => store.user);
  const { currentMember } = useAppSelector((store) => store.dao);

  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [modal, contextHolder] = Modal.useModal();

  const { currentDAO } = useAppSelector((store) => store.dao);

  useImperativeHandle(ref, () => ({
    show: (permissions: number[]) => {
      setIsModalOpen(true);
      setInitialValues({ permissions });
    },
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeateArray(currentMember.permissions, values.permissions));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    const add = [] as number[]; // 添加的权限
    const remove: any = [] as number[]; // 删除的权限

    values.permissions.forEach((v: any) => {
      if (!currentMember.permissions.includes(v)) add.push(v);
    });

    currentMember.permissions.forEach((v: any) => {
      if (!values.permissions.includes(v)) remove.push(v);
    });

    try {
      setLoading(true);
      await setPermissions(
        currentMember.tokenId,
        add,
        remove,
        values.permissions,
      );
      setLoading(false);
      handleCancel();
      // router.push('/dashboard/governance/votes');

      modal.success({
        title: formatMessage({ id: 'proposal.create.message' }),
        className: 'modal-small',
      });
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
      <Modal
        width={512}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <div className="content">
          <div className="h1">
            {formatMessage({ id: 'my.information.rights' })}
          </div>
          {/* <div className="h2"></div> */}

          <Form
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
                  {/* <Col span={12}>
                  <Checkbox value={Permissions.Action_Asset_Shell_Withdraw}>
                    上架资产
                  </Checkbox>
                </Col> */}
                  <Col span={16}>
                    <Checkbox value={Permissions.Action_DAO_Settings}>
                      {formatMessage({ id: 'my.information.rights.basic' })}
                    </Checkbox>
                  </Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>

            <Form.Item style={{ margin: '60px 0 0', textAlign: 'center' }}>
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
        </div>

        <style jsx>
          {`
            .content {
              padding: 25px 16px;
            }

            .h1 {
              margin-bottom: 30px;
              font-size: 20px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #000000;
              line-height: 30px;
            }

            .h2 {
              margin-top: 7px;
              margin-bottom: 30px;
              font-size: 12px;
              font-family: AppleSystemUIFont;
              color: #969ba0;
              line-height: 18px;
            }

            .content :global(.input) {
              height: 76px;
              font-size: 18px;
            }

            .content :global(.button-submit) {
              width: 168px;
              height: 54px;
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              line-height: 27px;
            }

            .content :global(.ant-form-item .ant-form-item-label > label) {
              font-size: 16px;
            }
          `}
        </style>
      </Modal>
      {contextHolder}
    </>
  );
};

export default forwardRef(App);
