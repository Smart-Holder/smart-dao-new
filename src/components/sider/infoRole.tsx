import { Avatar, Image, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

import RoleModal from '@/components/modal/roleModal';

import { useAppSelector } from '@/store/hooks';
import { formatAddress } from '@/utils';
import { getMakeDAOStorage } from '@/utils/launch';

const { Paragraph } = Typography;

const App = ({ type }: { type?: string }) => {
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const [data, setData] = useState({}) as any;

  useEffect(() => {
    if (type === 'cache') {
      const values = getMakeDAOStorage('start') || {};
      setData({
        address: values?.members[0]?.owner || '',
      });
    } else {
      setData({
        image: currentMember.image,
        name: currentMember.name,
        address: currentMember.host,
      });
    }
  }, [type, currentMember]);

  const roleModal: any = useRef(null);

  const onChange = () => {
    if (type !== 'cache') {
      roleModal.current.show();
    }
  };

  return (
    <>
      <div className="role" onClick={onChange}>
        <Space size={16}>
          {data.image ? (
            <Avatar size={34} src={data.image} />
          ) : (
            <Avatar size={34} icon={<UserOutlined />} />
          )}
          <span className="rolename ellipsis">
            {data.name || formatAddress(data.address)}
          </span>
          <Image
            src="/images/arrow/icon_nav_side_switch_default@2x.png"
            width={10}
            height={10}
            alt=""
            preview={false}
          />
        </Space>
      </div>

      <RoleModal ref={roleModal} />

      <style jsx>
        {`
          .role {
            position: fixed;
            left: 0;
            bottom: 0;
            box-sizing: border-box;
            width: 234px;
            height: 65px;
            margin-left: 32px;
            padding: 16px 4px;
            background-color: #fff;
            border-top: 1px solid #f5f5f5;
            cursor: pointer;
          }

          .role .rolename {
            width: 80px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .role .rolename :global(.ant-typography) {
            width: 80px;
            margin-bottom: 0;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }
        `}
      </style>
    </>
  );
};

export default App;
