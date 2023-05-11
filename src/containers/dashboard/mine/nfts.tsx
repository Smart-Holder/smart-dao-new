import { Button, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';

import { useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';
import { useDaosNfts, AssetsResponseType } from '@/api/graph/nfts';
// import { useRouter } from 'next/router';

import NFT from '@/containers/dashboard/mine/nft';
dayjs.extend(customParseFormat);

const App = () => {
  const { formatMessage } = useIntl();
  // const router = useRouter();
  const { currentDAO } = useAppSelector((store) => store.dao);
  const { chainId, address } = useAppSelector((store) => store.wallet);

  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<AssetsResponseType[]>([]);

  // 设置默认页数请求7个NFT则有更多NFT 否则没有
  const { items: AssetNftDatas } = useDaosNfts({
    host: currentDAO.id,
    first: 7,
    skip: pageStart,
    chainId,
  });

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId,
        host: currentDAO.host || currentDAO.id,
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
        host: currentDAO.id,
        state: 0,
      },
    });

    setTotal(t);
    setPageStart(0);
    setData(AssetNftDatas || []);
  };

  useEffect(() => {
    if (currentDAO.id) {
      setData([]);
      setTotal(0);
      resetData();
    }
  }, [chainId, address, currentDAO.id]);

  useEffect(() => {
    if (AssetNftDatas?.length) {
      setData(AssetNftDatas || []);
    }
  }, [AssetNftDatas]);

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

      {data.length > total && (
        <div className="footer">
          <Button className="button-all" onClick={getData}>
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
