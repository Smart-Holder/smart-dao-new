import React, { useEffect } from 'react';
import { Layout, Space } from 'antd';
import Image from 'next/image';
import router from 'next/router';
import dynamic from 'next/dynamic';

import Search from '@/components/search';
// import Menu from '@/components/header/menu';
// import Language from '@/components/header/language';

import logo from '/public/logo.png';

const Menu = dynamic(() => import('@/components/header/menu'), { ssr: false });
const Language = dynamic(() => import('@/components/header/language'), {
  ssr: false,
});

const Header = () => {
  const handleClick = () => {
    router.push('/');
  };

  return (
    <div className="wrap">
      <Layout.Header className="header">
        <div className="left">
          <div className="logo" onClick={handleClick} />
          {/* <Image style={{ cursor: 'pointer' }} src={logo} alt="logo" width={85} height={35} onClick={handleClick} /> */}
          <span className="name" onClick={handleClick}>
            SmartDAO
          </span>
          <Search />
        </div>
        <div>
          <Space size={26}>
            <Menu />
            <Language />
          </Space>
        </div>
      </Layout.Header>

      <style jsx>
        {`
          .wrap :global(.header) {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 88px;
            padding: 0 52px 0 31px;
            background: #fff;
          }

          .left {
            display: flex;
            align-items: center;
          }

          .logo {
            display: inline-block;
            width: 44px;
            height: 44px;
            background: linear-gradient(164deg, #2f4cdd 0%, #d45bff 100%);
            border-radius: 6px;
            cursor: pointer;
          }

          .name {
            height: 54px;
            margin-left: 13px;
            margin-right: 60px;
            font-size: 24px;
            font-weight: 400;
            color: #3c4369;
            line-height: 53px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Header;
