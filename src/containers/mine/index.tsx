import { useState } from 'react';
import { Divider, Space, Button } from 'antd';

import { useIntl } from 'react-intl';

import DAO from '@/containers/mine/daoList';
import Info from '@/containers/mine/info';

export default function Mine() {
  const { formatMessage } = useIntl();

  const [active, setActive] = useState(1);

  const handleDAOClick = () => {
    setActive(1);
  };

  const handleInfoClick = () => {
    setActive(2);
  };

  return (
    <div className="wrap">
      <Space size={50} split={<Divider className="divider" type="vertical" />}>
        <Button
          className={`button ${active === 1 ? 'active' : ''}`}
          type="link"
          onClick={handleDAOClick}
        >
          {formatMessage({ id: 'my.home.dao' })}
        </Button>
        <Button
          className={`button ${active === 2 ? 'active' : ''}`}
          type="link"
          onClick={handleInfoClick}
        >
          {formatMessage({ id: 'my.home.information' })}
        </Button>
      </Space>
      {/* <Tabs defaultActiveKey="1" items={items} onChange={onChange} /> */}
      <div>
        {active === 1 && <DAO />}
        {active === 2 && <Info />}
      </div>

      <style jsx>
        {`
          .wrap :global(.divider) {
            height: 32px;
            border-width: 3px;
            border-color: #000;
          }

          .wrap :global(.button) {
            height: 40px;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #000;
            line-height: 30px;
            outline: none;
          }

          .wrap :global(.active) {
            color: #546ff6;
          }
        `}
      </style>
    </div>
  );
}
