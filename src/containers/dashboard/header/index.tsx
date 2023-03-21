import React, { ReactNode } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Avatar, Button, Col, Image, Row, Space } from 'antd';
import buffer from 'somes/buffer';

import Title from '@/containers/dashboard/header/title';

type Data = {
  title?: string;
  buttons?: ReactNode;
  children?: ReactNode;
  padding?: boolean;
};

const App = ({ title, buttons, children, padding }: Data) => {
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const extend = { poster: '' };
  // const extend = currentDAO?.extend
  //   ? JSON.parse(currentDAO.extend || '{}')
  //   : {};

  console.log('extend', buffer.from(currentDAO.extend.data).toString());

  return (
    <div>
      {title && <Title title={title} />}

      {currentDAO.image && (
        <div className="image-box">
          <Image
            className="poster"
            src={extend?.poster || currentDAO.image}
            width="100%"
            height={380}
            preview={false}
            alt=""
          />
          <div className="avatar">
            <Avatar
              style={{
                backgroundColor: '#fff',
                borderWidth: 2,
                borderRadius: 10,
              }}
              size={70}
              src={currentDAO.image}
              shape="square"
            />
          </div>
        </div>
      )}

      <div className={padding ? 'padding' : ''}>
        <Row gutter={24} style={{ marginTop: 55 }}>
          <Col span={12}>
            <div className="name">{currentDAO.name}</div>
          </Col>
          {buttons && (
            <Col
              span={10}
              offset={2}
              style={{ textAlign: padding ? 'left' : 'right' }}
            >
              <Space size={20}>{buttons}</Space>
            </Col>
          )}
        </Row>

        {children}
      </div>

      <style jsx>
        {`
          .image-box {
            position: relative;
            margin-top: 30px;
            border: 1px solid #f1f1f1;
          }

          .image-box :global(.poster) {
            object-fit: cover;
            border-radius: 2px;
          }

          .avatar {
            position: absolute;
            left: 58px;
            bottom: -35px;
          }

          .padding {
            padding: 0 58px;
          }

          .name {
            height: 50px;
            font-size: 28px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #000000;
            line-height: 40px;
          }
        `}
      </style>
    </div>
  );
};

export default App;