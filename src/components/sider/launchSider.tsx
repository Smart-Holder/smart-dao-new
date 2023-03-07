import { useEffect, useRef, useState } from 'react';
import { Layout, Space, Avatar, Typography } from 'antd';
import { useRouter } from 'next/router';
import { UserOutlined } from '@ant-design/icons';
// import Image from 'next/image';

import Menu from '@/components/menu/launchMenu';
import RoleModal from '@/components/modal/roleModal';

import { useAppSelector } from '@/store/hooks';

import { formatAddress } from '@/utils';
import { getMakeDAOStorage } from '@/utils/launch';

// import logo from '/public/logo.png';

const { Paragraph } = Typography;

const App = () => {
  const router = useRouter();

  const roleModal: any = useRef(null);
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const [cacheDAO, setCacheDAO] = useState({}) as any;

  useEffect(() => {
    const values = getMakeDAOStorage('start') || {};
    setCacheDAO(values);
  }, [chainId, address]);

  const handleClick = () => {
    router.push('/');
  };

  return (
    <Layout.Sider
      width="240"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '18px 4px 35px 0px rgba(0,0,0,0.02)',
      }}
    >
      <div className="top">
        <Space size={13}>
          <span className="logo" onClick={handleClick}></span>
          {/* <Image
            style={{ cursor: 'pointer' }}
            src={logo}
            alt="logo"
            width={85}
            height={35}
            onClick={handleClick}
          /> */}
          <span className="name" onClick={handleClick}>
            SmartDAO
          </span>
        </Space>
      </div>

      <div className="user">
        <Space size={16}>
          {cacheDAO.image ? (
            <Avatar size={44} src={cacheDAO.image} />
          ) : (
            <Avatar size={44} icon={<UserOutlined />} />
          )}

          <span className="username">
            {cacheDAO.name ? (
              <Paragraph ellipsis={{ rows: 1 }}>{cacheDAO.name}</Paragraph>
            ) : (
              cacheDAO.address
            )}
          </span>
        </Space>
      </div>

      <div className="role">
        <Space size={16}>
          <Avatar size={44} icon={<UserOutlined />} />
          <span className="rolename">
            {formatAddress(
              cacheDAO?.members ? cacheDAO?.members[0]?.owner : '',
            )}
          </span>
        </Space>
      </div>

      <Menu />

      <RoleModal ref={roleModal} />

      <style jsx>
        {`
          .top {
            padding: 21px 10px 16px 32px;
          }

          .top .logo {
            display: inline-block;
            width: 44px;
            height: 44px;
            background: linear-gradient(164deg, #2f4cdd 0%, #d45bff 100%);
            border-radius: 6px;
            cursor: pointer;
          }

          .top .name {
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #3c4369;
            line-height: 44px;
            cursor: pointer;
          }

          .user {
            padding: 16px 10px 16px 32px;
          }

          .user .username {
            font-size: 20px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 28px;
          }

          .user .username :global(.ant-typography) {
            max-width: 130px;
            margin-bottom: 0;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }

          .role {
            display: flex;
            padding: 19px 12px 19px 32px;
            border-top: 1px solid #e5e7e8;
          }

          .role .rolename {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }

          .role .rolename :global(.ant-typography) {
            width: 80px;
            margin-bottom: 0;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }
        `}
      </style>
    </Layout.Sider>
  );
};

export default App;
