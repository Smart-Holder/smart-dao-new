import { Breadcrumb, PaginationProps } from 'antd';
import Layout from '@/components/layout';
import { ReactElement, useEffect, useState } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';
import styles from '@/styles/content.module.css';
import DetailHeader from '@/containers/dashboard/financial/detail-header';
import DetailMarket from '@/containers/dashboard/financial/detail-market';
import DetailAttributes from '@/containers/dashboard/financial/detail-attributes';
import DetailTransactions, {
  DetailTransactionItem,
} from '@/containers/dashboard/financial/detail-transactions';
import { request } from '@/api';
import { useAppSelector } from '@/store/hooks';
import { useIntl } from 'react-intl';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();
  const { chainId } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);
  const pageSize = 20;

  const storageData = JSON.parse(localStorage.getItem('asset') || '{}') || {};
  const extra = storageData?.properties || [];

  let attr = extra.find((item: any) => item.trait_type === 'attr');
  attr = attr?.value.split(',');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DetailTransactionItem[]>([]);

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

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/dashboard/mine/assets">
          {formatMessage({ id: 'sider.my.asset' })}
        </Breadcrumb.Item>
        <Breadcrumb.Item>Detail</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ margin: '50px 80px' }}>
        <div>
          <DetailHeader
            title={`${storageData.name} #${storageData.id}`}
            logo={storageData.imageOrigin}
          />

          {storageData.selling !== 0 && <DetailMarket />}

          {storageData.properties && (
            <DetailAttributes
              // items={[{ key: attr[0], value: attr[1], ratio: attr[2] }]}
              items={storageData.properties}
            />
          )}

          <DetailTransactions
            currentPage={page}
            total={total}
            pageSize={pageSize}
            data={data}
          />
        </div>
      </div>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
