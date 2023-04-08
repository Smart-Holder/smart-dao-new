import { Button, List } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';
import { AssetExt } from '@/config/define_ext';

import NFT from '@/containers/dashboard/mine/nft';

dayjs.extend(customParseFormat);

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const { chainId } = useAppSelector((store) => store.wallet);

  const pageSize = useRef(8);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<AssetExt[]>([]);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const getData = async () => {
    setLoading(true);

    const t = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: {
        chain: chainId || defaultChain,
        state: 0,
        selling_not: 0,
      },
    });

    setTotal(t);

    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId || defaultChain,
        state: 0,
        selling_not: 0,
        limit: [0, 8],
        orderBy: 'blockNumber desc',
      },
    });

    setLoading(false);
    setData(res);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    getData();
  }, [chainId]);

  const renderItem = (item: AssetExt) => {
    if (!item.dao) {
      return null;
    }

    return (
      <List.Item style={{ padding: 0 }}>
        <NFT data={item} />
      </List.Item>
    );
  };

  const getAll = () => {
    router.push('/nfts');
  };

  return (
    <div style={{ paddingBottom: 50 }}>
      <div className="header">NFTs</div>

      <List
        grid={{ gutter: 20, column: 4 }}
        loading={loading}
        rowKey="id"
        dataSource={data}
        renderItem={renderItem}
      />

      {data.length > 0 && pageSize.current < total && (
        <div style={{ paddingTop: 40, textAlign: 'center' }}>
          <Button className="button-view-all" onClick={getAll}>
            {formatMessage({ id: 'viewAllNfts' })}
          </Button>
        </div>
      )}

      <style jsx>
        {`
          .header {
            height: 30px;
            margin: 70px 0 40px;
            font-size: 38px;
            font-family: var(--font-family-secondary);
            font-weight: bold;
            color: #000000;
            line-height: 30px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
