import React from 'react';
import { Col, Layout, Row, Space, Image } from 'antd';
import router from 'next/router';
import dynamic from 'next/dynamic';

const Search = dynamic(() => import('@/components/search'), { ssr: false });
const Menu = dynamic(() => import('@/components/header/menu'), { ssr: false });
const Language = dynamic(() => import('@/components/header/language'), {
  ssr: false,
});

const Header = ({ type }: { type?: string }) => {
  const handleClick = () => {
    router.push('/');
  };

  return (
    <Layout.Header className="header">
      <div
        className={`${
          type === 'fix' ? 'header-content-fix' : 'header-content'
        }`}
      >
        <Row gutter={16} style={{ width: '100%' }} align="middle">
          <Col span={8}>
            <Image
              style={{ cursor: 'pointer' }}
              src="/images/icon_logo_dark@2x.png"
              alt="logo"
              width={174}
              height={60}
              onClick={handleClick}
              preview={false}
            />
          </Col>
          <Col span={8}>
            <Search />
          </Col>
          <Col span={8}>
            <div className="right">
              <Language />
              <Menu />
            </div>
          </Col>
        </Row>
        {/* <div className="left">
          <Image
            style={{ cursor: 'pointer' }}
            src={logo}
            alt="logo"
            width={175}
            height={54}
            onClick={handleClick}
          />
        </div>
        <Search />
        <Space size={55}>
          <Language />
          <Menu />
        </Space> */}
      </div>
      <style jsx>
        {`
          .header-content-fix {
            display: flex;
            align-items: center;
            max-width: var(--max-width);
            height: 76px;
            padding: 0 80px;
            margin: 0 auto;
          }

          .header-content {
            display: flex;
            align-items: center;
            width: 100%;
            height: 75px;
            padding: 0 32px;
            margin: 0 auto;
            border-bottom: 1px solid #f5f5f5;
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

          .right {
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        `}
      </style>
    </Layout.Header>
  );
};

export default Header;
