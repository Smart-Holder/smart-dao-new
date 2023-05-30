import React, { useState, useEffect } from 'react';
import { Button, Input, message } from 'antd';
import { Form } from 'antd';

import Modal from '@/components/modal';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { validateEthAddress } from '@/utils/validator';
import { setCurrentDAO } from '@/store/features/daoSlice';

import { request } from '@/api';
import { isPermission, setExecutor } from '@/api/member';
import { createVote } from '@/api/vote';
import { useIntl } from 'react-intl';
import { isRepeate, tokenIdFormat } from '@/utils';
import { Permissions, proposalType } from '@/config/enum';
import { getMessage } from '@/utils/language';
import { useDao, useDaoMembers } from '@/api/graph/dao';
import { membersType } from '@/api/typings/dao';

// const options = [
//   { label: 'Apple', value: 'Apple' },
//   { label: 'Pear', value: 'Pear' },
//   { label: 'Orange', value: 'Orange' },
// ];

const App = () => {
  const [form] = Form.useForm();
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  // const { loading } = useAppSelector((store) => store.common);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<membersType[]>([]);
  const [initialValues, setInitialValues] = useState(null) as any;
  const [isEdit, setIsEdit] = useState(false);

  const { data, fetchMore } = useDaoMembers();
  const { fetchMore: fetchMoreDao } = useDao();

  useEffect(() => {
    const getMembers = async () => {
      // const members = await request({
      //   name: 'utils',
      //   method: 'getMembersFrom',
      //   params: { chain: chainId, host: currentDAO.host },
      // });

      await fetchMore({
        variables: {
          host: currentDAO.host,
        },
      });

      // setMembers(members);
      // const member = members.find(
      //   (item: any) => item.tokenId === currentDAO.executor,
      // );

      // const values = { address: '', executor: '' };

      // if (member) {
      //   values.address = member.owner;
      //   values.executor = member.tokenId;
      // }

      // console.log('values', values);

      // setInitialValues(values);
      // form.setFieldsValue({ ...values });
    };

    if (chainId && currentDAO.host) {
      getMembers();
    }
  }, [chainId, currentDAO]);

  useEffect(() => {
    if (data) {
      setMembers(data);
      const member = data.find(
        (item: any) => item.tokenId === currentDAO.executor,
      );
      const values = { address: '', executor: '' };
      if (member) {
        values.address = member.owner as string;
        values.executor = member.tokenId;
      }
      setInitialValues(values);
      form.setFieldsValue({ ...values });
    }
  }, [data]);

  const onValuesChange = (changedValues: any, values: any) => {
    setIsEdit(!isRepeate(initialValues, values));
  };

  const onFinish = async (values: any) => {
    console.log('validate Success:', values);

    const member: any = members.find(
      (item: any) => item.owner.toLowerCase() === values.address.toLowerCase(),
    );

    if (member?.tokenId) {
      // 提案通过后执行 setExecutor
      const extra = [
        {
          abi: 'member',
          target: currentDAO.member,
          method: 'setExecutor',
          params: [member.tokenId],
        },
      ];

      // 生成提案的参数
      const params = {
        name: formatMessage({ id: 'proposal.basic.executor' }),
        description: JSON.stringify({
          type: 'basic',
          proposalType: proposalType.Basic_Executor,
          values: {
            ...values,
            former: initialValues.address,
          },
        }),
        extra,
      };

      try {
        setLoading(true);

        if (!(await isPermission(Permissions.Action_DAO_Settings))) {
          await createVote(params);
          Modal.success({
            title: formatMessage({ id: 'proposal.create.message' }),
          });
          // message.success(formatMessage({ id: 'governance.proposal.success' }));
        } else {
          await setExecutor({ id: member.tokenId });
          message.success('Success');
        }

        const { data: daoData } = await fetchMoreDao({
          variables: {
            host: currentDAO.address.toLocaleLowerCase(),
          },
        });

        if (daoData) {
          dispatch(setCurrentDAO(daoData.dao));
        }

        setIsEdit(false);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      message.error('no such member');
    }
  };

  // const onFinish = async (values: any) => {
  //   const permission = currentMember.permissions.includes(
  //     Permissions.Action_DAO_Settings,
  //   );

  //   if (!permission) {
  //     message.warning('没有权限');
  //     return;
  //   }

  //   console.log('validate Success:', values);
  //   setLoading(true);

  //   const member: any = members.find(
  //     (item: any) => item.owner.toLowerCase() === values.address.toLowerCase(),
  //   );

  //   if (member?.tokenId) {
  //     await setExecutor({ id: member.tokenId });
  //     message.success('success');

  //     const dao = await request({
  //       method: 'getDAO',
  //       name: 'utils',
  //       params: { chain: chainId, address: currentDAO.address },
  //     });

  //     setLoading(false);

  //     if (dao) {
  //       dispatch(setCurrentDAO(dao));
  //       sessionStorage.setItem('currentDAO', JSON.stringify(dao));
  //       // window.location.reload();
  //     }
  //   } else {
  //     message.error('没有该成员');
  //     setLoading(false);
  //   }
  // };

  const onFinishFailed = (errorInfo: any) => {
    console.log('validate Failed:', errorInfo);
  };

  if (!initialValues) {
    return null;
  }

  return (
    <div className="card">
      {/* <div style={{ marginTop: 15 }}>
        <span className="label">User Name:</span>
        <span className="value">abc</span>
      </div> */}

      <Form
        className="form"
        name="info"
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
        <div className="h1">
          {formatMessage({ id: 'basic.executor.title' })}
        </div>
        <div className="h2">
          {formatMessage({ id: 'basic.executor.subtitle' })}
        </div>

        <Form.Item
          name="address"
          style={{ marginTop: 40 }}
          label={formatMessage({ id: 'address' })}
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          <Input />
        </Form.Item>
        <Form.Item style={{ marginTop: 100 }}>
          <Button
            className="button-submit"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isEdit}
          >
            {formatMessage({ id: 'basic.executor.replace' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
