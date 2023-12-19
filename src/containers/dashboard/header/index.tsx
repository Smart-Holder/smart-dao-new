import React, { ReactNode, useCallback, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Avatar, Button, Col, Image, Row, Space } from 'antd';
import buffer from 'somes/buffer';

import Title from '@/containers/dashboard/header/title';
import { formatToObj } from '@/utils/extend';
import { imageView2Max } from '@/utils';

type Data = {
  title?: string;
  avatar?: string;
  name?: string;
  buttons?: ReactNode;
  children?: ReactNode;
  padding?: boolean;
};

const App = ({ title, avatar, name, buttons, children, padding }: Data) => {
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const [blobType, setblobType] = React.useState('');

  const extend = formatToObj(currentDAO?.extend?.data);
  // file.type.startsWith('image/') || file.type.startsWith('video/');

  const getImgFileType = useCallback(async () => {
    let url = extend.poster;
    let res = await fetch(url);
    if (res.ok) {
      let blob = await res.blob();
      setblobType(blob.type);
    }
  }, [extend]);

  useEffect(() => {
    if (extend.poster) {
      getImgFileType();
    }
  }, [extend, getImgFileType]);

  return (
    <div>
      {title && <Title title={title} />}

      {currentDAO.image && (
        <div className="image-box">
          {blobType.startsWith('image/') ? (
            <Image
              className="poster"
              src={imageView2Max({
                url: extend?.poster || currentDAO.image,
                w: 1920,
              })}
              width="100%"
              height={380}
              preview={false}
              alt=""
            />
          ) : (
            <video
              className="poster"
              src={extend?.poster}
              width="100%"
              height={380}
              autoPlay
              loop
              muted
              controls={false}
              style={{ objectFit: 'cover' }}
            />
          )}

          <div className="avatar">
            <Avatar
              style={{
                backgroundColor: '#fff',
                borderWidth: 2,
                borderRadius: 10,
              }}
              size={70}
              src={imageView2Max({
                url: avatar || currentDAO.image,
                w: 120,
              })}
              shape="square"
            />
          </div>
        </div>
      )}

      <div className={padding ? 'padding' : ''}>
        <Row gutter={24} style={{ marginTop: 55 }}>
          <Col span={12}>
            <div className="name">{name || currentDAO.name}</div>
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
