import { Skeleton, Col, Empty, Row } from 'antd';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { useEffect, useRef, useState } from 'react';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';

import NFT from '@/containers/dashboard/mine/nft';

dayjs.extend(customParseFormat);

const App = () => {
  const { loading, searchText } = useAppSelector((store) => store.common);
  const { chainId } = useAppSelector((store) => store.wallet);

  const pageSize = useRef(20);
  const [pageStart, setPageStart] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]) as any;
  const [init, setInit] = useState(false);

  const defaultChain = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN);

  const getData = async () => {
    const res = await request({
      name: 'utils',
      method: 'getAssetFrom',
      params: {
        chain: chainId || defaultChain,
        name: searchText,
        state: 0,
        selling_not: 0,
        limit: [pageStart, pageSize.current],
        orderBy: 'blockNumber desc',
      },
    });

    setPageStart(pageStart + pageSize.current);
    setData([...data, ...res]);
  };

  const resetData = async () => {
    const t = await request({
      name: 'utils',
      method: 'getAssetTotalFrom',
      params: {
        chain: chainId || defaultChain,
        name: searchText,
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
        name: searchText,
        state: 0,
        selling_not: 0,
        limit: [0, pageSize.current],
        orderBy: 'blockNumber desc',
      },
    });

    setPageStart(pageSize.current);
    setData(res);
    setInit(true);
  };

  useEffect(() => {
    setData([]);
    setTotal(0);
    resetData();
  }, [searchText, chainId]);

  return (
    <div>
      <div className="h1">NFTs</div>

      <InfiniteScroll
        dataLength={data.length}
        next={getData}
        hasMore={data.length < total}
        loader={
          <Skeleton style={{ marginTop: 20 }} paragraph={{ rows: 1 }} active />
        }
        scrollableTarget="nftScrollTarget"
      >
        <div style={{ overflow: 'hidden', padding: 5 }}>
          <Row gutter={[16, 16]}>
            {data.map((item: any) => {
              if (!item?.dao) {
                return null;
              }

              return (
                <Col span={6} key={item.id}>
                  <NFT data={item} />
                </Col>
              );
            })}

            {data.length === 0 && !loading && init && (
              <div className="empty">
                <Empty />
              </div>
            )}
          </Row>
        </div>
      </InfiniteScroll>

      <style jsx>
        {`
          .h1 {
            height: 98px;
            padding: 40px 5px 0;
            margin-bottom: 20px;
            font-size: 48px;
            font-family: var(--font-family-secondary);
            font-weight: bold;
            color: #000000;
            line-height: 58px;
          }

          .empty {
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default App;
