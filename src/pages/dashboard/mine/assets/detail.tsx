import { Avatar, Breadcrumb, Button, message, PaginationProps } from 'antd';
import Layout from '@/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import DetailMarket from '@/containers/dashboard/financial/detail-market';
import DetailTransactions from '@/containers/dashboard/financial/detail-transactions';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { useIntl } from 'react-intl';
import Card, { CardDataProps } from '@/components/card';
import Header from '@/containers/dashboard/financial/detail/header';
import { AssetOrderExt } from '@/config/define_ext';
import { useLayoutNftList } from '@/api/graph/nfts';

const list = [{ name: 'OpenSea', image: '/images/opensea.png' }];

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const pageSize = 20;

  const storageData = JSON.parse(localStorage.getItem('asset') || '{}') || {};
  const extra = storageData?.properties || [];

  let attr = extra.find((item: any) => item.trait_type === 'attr');
  attr = attr?.value.split(',');

  const blockchain = extra.find(
    (item: any) => item.trait_type === 'blockchain',
  );

  const owner = address.toLowerCase() === storageData.owner.toLowerCase();

  const cardData: CardDataProps[] = [];
  extra.forEach((item: any) => {
    if (item.trait_type && item.trait_type !== 'tags') {
      cardData.push({
        label: item.trait_type,
        value: item.value,
        ratio: item.ratio || '',
      });
    }
  });

  const { data: listData, fetchMore } = useLayoutNftList({
    first: pageSize,
    skip: 0,
    asset: storageData.assetId,
  });

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<AssetOrderExt[]>([]);

  useEffect(() => {
    // const getData = async () => {
    //   const res = await request({
    //     name: 'utils',
    //     method: 'getAssetOrderFrom',
    //     params: {
    //       chain: chainId,
    //       host: currentDAO.host,
    //       tokenId: storageData.tokenId,
    //       fromAddres_not: '0x0000000000000000000000000000000000000000',
    //     },
    //   });

    //   if (res) {
    //     setData(res);
    //   }
    // };

    // if (storageData.tokenId) {
    // getData();
    // }

    if (storageData.assetId) {
      fetchMore({
        variables: {
          first: pageSize,
          skip: 0,
          asset: storageData.assetId,
        },
      });
    }
  }, []);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    // getData(p);
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard/mine/assets">
          {formatMessage({ id: 'sider.my.asset' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ margin: '30px 80px 80px' }}>
        <Header />
        {/* <DetailHeader
          title={`${storageData.name} #${storageData.id}`}
          logo={storageData.imageOrigin}
        /> */}

        {storageData.selling !== 0 && owner && <DetailMarket />}

        {/* {storageData.properties && (
            <DetailAttributes
              items={storageData.properties}
            />
          )} */}

        {storageData.properties && (
          <Card
            style={{ marginTop: 80 }}
            title={formatMessage({ id: 'financial.asset.property' })}
            data={cardData}
          />
        )}
      </div>

      <DetailTransactions
        currentPage={page}
        total={total}
        pageSize={pageSize}
        // data={data}
        data={listData}
      />

      <style jsx>
        {`
          .dao-info-item {
            height: 25px;
            margin-top: 20px;
            font-size: 18px;
            font-weight: 500;
            color: #000000;
            line-height: 25px;
          }

          .market-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 50px;
          }

          .market-list-item {
            margin: 0 30px;
            cursor: pointer;
          }

          .market-list-item-name {
            height: 24px;
            margin-top: 32px;
            font-size: 20px;
            font-weight: 600;
            color: #000000;
            line-height: 24px;
          }
        `}
      </style>
    </div>
  );
};

export default App;
