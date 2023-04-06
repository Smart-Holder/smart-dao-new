import { Avatar, Breadcrumb, Button, message, PaginationProps } from 'antd';
import Layout from '@/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import DetailMarket from '@/containers/dashboard/financial/detail-market';
import DetailTransactions, {
  DetailTransactionItem,
} from '@/containers/dashboard/financial/detail-transactions';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { useIntl } from 'react-intl';
import Card, { CardDataProps } from '@/components/card';
import DashboardHeader from '@/containers/dashboard/header';
import { shelves } from '@/api/asset';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from '@/components/modal';
import Header from '@/containers/dashboard/financial/detail/header';

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

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DetailTransactionItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const res = await request({
        name: 'utils',
        method: 'getAssetOrderFrom',
        params: {
          chain: chainId,
          host: currentDAO.host,
          tokenId: storageData.tokenId,
        },
      });

      if (res) {
        setData(res);
      }
    };

    if (storageData.tokenId) {
      getData();
    }
  }, []);

  const onPageChange: PaginationProps['onChange'] = (p) => {
    setPage(p);
    // getData(p);
  };

  const onShelves = async (name: string) => {
    const params = {
      token: storageData.token,
      tokenId: storageData.tokenId,
      amount: storageData.minimumPrice,
    };

    try {
      setLoading(true);
      await shelves(params);
      message.success('success');
      // window.location.reload();
      setLoading(false);
      hideModal();
    } catch (error: any) {
      // console.error(error);
      // message.error(error?.message);
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
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
        data={data}
      />

      <Modal type="normal" open={isModalOpen} onCancel={hideModal}>
        <div className="title">
          {formatMessage({ id: 'financial.asset.tradingMarket' })}
        </div>
        <div className="market-list">
          {list.map((item, i) => (
            <div
              key={i}
              className="market-list-item"
              onClick={() => {
                onShelves(item.name);
              }}
            >
              {!loading ? (
                <Avatar src={item.image} size={88} alt="" />
              ) : (
                // <LoadingOutlined style={{ fontSize: 88 }} />
                <Avatar size={88} icon={<LoadingOutlined />} />
              )}
              <div className="market-list-item-name">{item.name}</div>
            </div>
          ))}
        </div>
      </Modal>

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

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
