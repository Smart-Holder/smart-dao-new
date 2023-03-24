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
import { formatAddress } from '@/utils';
import { shelves } from '@/api/asset';
import { LoadingOutlined } from '@ant-design/icons';
import Modal from '@/components/modal';

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
      console.error(error);
      message.error(error?.message);
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

      <div style={{ padding: '30px 91px 0 82px' }}>
        <DashboardHeader
          avatar={storageData.imageOrigin}
          name={`${storageData.name} #${storageData.id}`}
          buttons={
            currentMember.tokenId && owner ? (
              <>
                {/* <Button onClick={onShare}>分享</Button> */}
                {storageData.selling === 0 && (
                  <Button
                    type="primary"
                    className="smart-button"
                    onClick={showModal}
                  >
                    {formatMessage({ id: 'financial.asset.listing' })}
                  </Button>
                )}
              </>
            ) : null
          }
        >
          <div style={{ marginTop: 15 }} className="dao-info-item">
            {formatMessage({ id: 'financial.asset.address' })}:&nbsp;&nbsp;
            {formatAddress(storageData.token, 8)}
            {/* {storageData.token} */}
          </div>
          <div style={{ marginTop: 15 }} className="dao-info-item">
            {formatMessage({ id: 'financial.asset.tokenId' })}:&nbsp;&nbsp;
            {formatAddress(storageData.tokenId, 8)}
          </div>
          <div style={{ marginTop: 15 }} className="dao-info-item">
            {formatMessage({ id: 'financial.asset.chain' })}:&nbsp;&nbsp;
            {blockchain?.value}
          </div>
          <div style={{ marginTop: 15 }} className="dao-info-item">
            {formatMessage({ id: 'financial.asset.metadata' })}:&nbsp;&nbsp;
            {formatAddress(storageData.uri, 12)}
          </div>
          <div style={{ marginTop: 15 }} className="dao-info-item">
            {formatMessage({ id: 'financial.asset.royalties' })}:&nbsp;&nbsp;3%
          </div>
        </DashboardHeader>
      </div>

      <div style={{ margin: '0 80px 50px' }}>
        {/* <DetailHeader
          title={`${storageData.name} #${storageData.id}`}
          logo={storageData.imageOrigin}
        /> */}

        {storageData.selling !== 0 && <DetailMarket />}

        {/* {storageData.properties && (
            <DetailAttributes
              items={storageData.properties}
            />
          )} */}

        {storageData.properties && <Card data={cardData} />}
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
            font-family: SFUIText-Medium;
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
            font-family: SFUIText-Semibold;
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
