import { Button, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';

import NFT from '@/containers/dashboard/mine/nft';

dayjs.extend(customParseFormat);

const App = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId || defaultChain,
        state: 0,
        selling_not: 0,
        limit: [pageStart, 100],
        orderBy: 'blockNumber desc',
      },
    });

    setPageStart(100);
    setData([...data, ...res]);
  };

  const resetData = async () => {
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

    setPageStart(8);
    setData(res);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    resetData();
  }, [chainId]);

  const getAllData = () => {
    router.push('/nfts');
  };

  return (
    <div style={{ paddingBottom: 50 }}>
      <div className="header">NFTs</div>

      {data.length === 0 && <Empty />}

      <Row gutter={[19, 20]}>
        {data.map((item: any) => {
          if (!item.dao) {
            return null;
          }

          return (
            <Col span={6} key={item.id}>
              <NFT data={item} />
            </Col>
          );
        })}
      </Row>

      {data.length < total && (
        <div className="footer">
          <Button className="button-view-all" onClick={getAllData}>
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

          .footer {
            padding-top: 40px;
            text-align: center;
          }
        `}
      </style>
    </div>
  );
};

export default App;
