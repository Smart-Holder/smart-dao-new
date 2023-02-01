import { useEffect } from 'react';
import { Space } from 'antd';
import { getDAOList } from '@/store/features/daoSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import Item from '@/components/mine/item';

import { getCookie } from '@/utils/cookie';

export default function List({ type }: { type: number }) {
  const dispatch = useAppDispatch();

  const chainId = Number(getCookie('chainId'));
  const address = getCookie('address');

  const { DAOList } = useAppSelector((store) => store.dao);

  useEffect(() => {
    dispatch(getDAOList({ chain: chainId, owner: address }));
  }, []);

  console.log(DAOList);

  return (
    <div>
      <Space size={30}>
        {DAOList.map((item) => (
          <Item data={item} key={item.id} />
        ))}
      </Space>

      <style jsx>
        {`
          div {
            padding: 30px 16px;
          }
        `}
      </style>
    </div>
  );
}
