import { Button, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIntl } from 'react-intl';

import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';
import { useDaosNfts } from '@/api/graph/nfts';
import { AssetsResponseType } from '@/api/typings/nfts';
import { GET_DAOS_NFTS_ACTION } from '@/api/gqls/nfts';
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

  const { items: AssetNftDatas, fetchMore } = useDaosNfts({
    host: currentDAO.host,
    first: 6,
    skip: pageStart,
    chainId,
    destroyed: false,
  });

  const getData = async () => {
    fetchMore({
      query: GET_DAOS_NFTS_ACTION({
        destroyed: false,
        host: currentDAO.host,
      }),
      variables: {
        first: 6,
        skip: pageStart,
        chainId,
      },
    });

    // const res = await request({
    //   name: 'utils',
    //   method: 'getAssetFrom',
    //   params: {
    //     chain: chainId,
    //     host: currentDAO.host,
    //     state: 0,
    //     limit: [pageStart, 100],
    //   },
    // });

    setPageStart(100);
    // setData([...data, ...res]);
  };

  const resetData = useCallback(async () => {
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
    setPageStart(0);
    await fetchMore({
      query: GET_DAOS_NFTS_ACTION({
        destroyed: false,
        host: currentDAO.host,
      }),
      variables: {
        first: 6,
        skip: 0,
        chainId,
      },
    });
    // setData(AssetNftDatas || []);
  }, [chainId, currentDAO.host, fetchMore]);

  useEffect(() => {
    if (currentDAO.host) {
      setData([]);
      setTotal(0);
      resetData();
    }
  }, [chainId, address, currentDAO.host, resetData]);

  useEffect(() => {
    if (AssetNftDatas?.length) {
      setData([...data, ...(AssetNftDatas || [])]);
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
