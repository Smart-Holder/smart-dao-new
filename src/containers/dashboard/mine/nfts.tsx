import { Button, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';
// import { useRouter } from 'next/router';

import NFT from '@/containers/dashboard/mine/nft';

dayjs.extend(customParseFormat);

const App = () => {
  // const router = useRouter();
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        limit: [pageStart, 100],
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
        chain: chainId,
        host: currentDAO.host,
        state: 0,
      },
    });

    setTotal(t);

    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host: currentDAO.host,
        state: 0,
        limit: [0, 6],
      },
    });

    setPageStart(6);
    setData(res);
  };

  useEffect(() => {
    if (currentDAO.host) {
      setData([]);
      setTotal(0);
      resetData();
    }
  }, [chainId, address, currentDAO.host]);

  return (
    <>
      <div className="header">NFTs</div>

      {data.length === 0 && <Empty />}

      <Row gutter={[19, 20]}>
        {data.map((item: any) => (
          <Col span={8} key={item.id}>
            <NFT data={item} />
          </Col>
        ))}
      </Row>

      {data.length < total && (
        <div className="footer">
          <Button className="button-all" onClick={getData}>
            VIEW ALL NFTS
          </Button>
        </div>
      )}

      <style jsx>
        {`
          .header {
            height: 30px;
            margin: 70px 0 40px;
            font-size: 38px;
            font-family: AdobeDevanagari-Bold, AdobeDevanagari;
            font-weight: bold;
            color: #000000;
            line-height: 30px;
          }

          .footer {
            padding-top: 40px;
            text-align: center;
          }

          .footer :global(.button-all) {
            width: 260px;
            height: 46px;
            font-size: 18px;
            font-family: AdobeGurmukhi-Bold, AdobeGurmukhi;
            font-weight: bold;
            color: #000000;
            line-height: 27px;
            background: #ffffff;
            border-radius: 5px;
            border: 1px solid #000000;
          }
        `}
      </style>
    </>
  );
};

export default App;