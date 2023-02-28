import React, { useState, useEffect } from 'react';
import { Button, Input, Image, Avatar, message } from 'antd';
import { Form } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { validateChinese, validateEthAddress } from '@/utils/validator';

import { request } from '@/api';
import { setExecutor } from '@/api/member';
import { createVote } from '@/api/vote';
import { useIntl } from 'react-intl';
import { isRepeate } from '@/utils';

const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
];

const App = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  // const { loading } = useAppSelector((store) => store.common);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [initialValues, setInitialValues] = useState(null) as any;
  const [isEdit, setIsEdit] = useState(false);
  const url =
    'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';

  useEffect(() => {
    const getMembers = async () => {
      const members = await request({
        name: 'utils',
        method: 'getMembersFrom',
        params: { chain: chainId, host: currentDAO.host },
      });

      setMembers(members);
      const member = members.find(
        (item: any) => item.tokenId === currentDAO.executor,
      );

      const values = { address: '', executor: '' };

      if (member) {
        values.address = member.owner;
        values.executor = member.tokenId;
      }

      console.log('values', values);

      setInitialValues(values);
    };

    if (chainId && currentDAO.host) {
      getMembers();
    }
  }, []);

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
          method: 'setExecutor',
          params: [member.tokenId],
        },
      ];

      // 生成提案的参数
      const params = {
        name: formatMessage({ id: 'proposal.basic.executor' }),
        description: JSON.stringify({
          type: 'member',
          purpose: `${formatMessage({
            id: 'proposal.basic.executor',
          })}: ${values.address}`,
        }),
        extra,
      };

      try {
        setLoading(true);
        // await setExecutor({ id: member.tokenId });
        await createVote(params);
        message.success(formatMessage({ id: 'governance.proposal.success' }));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      message.error('没有该成员');
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
    <div className="wrap">
      <div className="h1">{formatMessage({ id: 'basic.executor.title' })}</div>
      <div className="h2">
        {formatMessage({ id: 'basic.executor.subtitle' })}
      </div>

      {/* <div style={{ marginTop: 15 }}>
        <span className="label">User Name:</span>
        <span className="value">abc</span>
      </div> */}

      <Form
        style={{ marginTop: 16 }}
        name="info"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onValuesChange={onValuesChange}
        autoComplete="off"
        labelAlign="left"
        requiredMark={false}
        validateTrigger="onBlur"
        layout="inline"
      >
        <Form.Item
          style={{ width: 480 }}
          name="address"
          rules={[{ required: true }, { validator: validateEthAddress }]}
        >
          {/* <Input className="input" prefix={<Avatar size={30} src={url} />} /> */}
          <Input className="input" />
        </Form.Item>
        <Form.Item>
          <Button
            className="button"
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isEdit}
          >
            {formatMessage({ id: 'basic.executor.replace' })}
          </Button>
        </Form.Item>
      </Form>

      <style jsx>
        {`
          .wrap {
            max-width: 690px;
          }

          .h1 {
            height: 30px;
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 30px;
          }

          .h2 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 18px;
            margin-top: 7px;
            font-size: 12px;
            font-family: AppleSystemUIFont;
            color: #969ba0;
            line-height: 18px;
          }

          .wrap .label {
            height: 21px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #969ba0;
            line-height: 21px;
          }

          .wrap .value {
            height: 21px;
            margin-left: 15px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #3c4369;
            line-height: 21px;
          }

          .wrap .item-group {
            display: flex;
          }

          .wrap :global(.input) {
            flex: 1;
            height: 54px;
            font-size: 18px;
          }

          .wrap :global(.button) {
            width: 140px;
            height: 54px;
            margin-left: 20px;
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 27px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
