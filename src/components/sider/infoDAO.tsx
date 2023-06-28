import { Avatar, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

import { useAppSelector } from '@/store/hooks';
import { getMakeDAOStorage } from '@/utils/launch';

import Ellipsis from '@/components/typography/ellipsis';
import { formatAddress, imageView2Max } from '@/utils';

const { Paragraph } = Typography;

const App = ({ type }: { type?: string }) => {
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const [dao, setDAO] = useState(currentDAO) as any;

  useEffect(() => {
    if (type === 'cache') {
      const values = getMakeDAOStorage('start') || {};
      setDAO(values);
    }
  }, [chainId, address, type]);

  return (
    <div className="dao">
      <Space size={16}>
        {dao.image ? (
          <Avatar
            size={44}
            src={imageView2Max({
              url: dao.image,
              w: 120,
              h: 120,
            })}
          />
        ) : (
          <Avatar size={44} icon={<UserOutlined />} />
        )}

        <span className="dao-name ellipsis">
          {dao.name || formatAddress(dao.host)}
        </span>
      </Space>

      <style jsx>
        {`
          .dao {
            padding: 14px 10px 14px 0;
            border-bottom: 1px solid #f5f5f5;
          }

          .dao-name {
            width: 130px;
            font-size: 16px;
            font-weight: 500;
            color: #000000;
            line-height: 22px;
          }

          .dao-name :global(.ant-typography) {
            width: 130px;
            margin-bottom: 0;
            font-size: 16px;
            font-weight: 400;
            color: #393939;
            line-height: 22px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
