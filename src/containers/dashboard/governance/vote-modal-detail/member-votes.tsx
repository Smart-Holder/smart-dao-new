import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import dynamic from 'next/dynamic';

import { useAppSelector } from '@/store/hooks';
import { request } from '@/api';

import styles from './detail.module.css';

const Pie = dynamic(() => import('@/components/charts/pie'), { ssr: false });

type Props = {
  data: {
    address: string;
    former: string;
  };
};

const App = ({ data }: Props) => {
  const { formatMessage } = useIntl();

  const { chainId, address } = useAppSelector((store) => store.wallet);
  const { currentDAO, currentMember } = useAppSelector((store) => store.dao);

  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    const getAllData = async (page = 1) => {
      const total = await request({
        name: 'utils',
        method: 'getMembersTotalFrom',
        params: {
          chain: chainId,
          host: currentDAO.host,
        },
      });

      setTotal(total);

      const res = await request({
        name: 'utils',
        method: 'getMembersFrom',
        params: {
          chain: chainId,
          host: currentDAO.host,
          limit: [0, Math.min(total, 10000)],
        },
      });

      const data = res || [];
      let totalVotes = 0;

      data.forEach((item: any) => {
        totalVotes += item.votes;
      });

      const per = 1 / totalVotes;

      const pieData = data.map((item: any) => {
        return {
          id: item.id + '',
          name: item.name,
          value: Number((per * item.votes * 100).toFixed(2)),
        };
      });

      setPieData(pieData);
    };

    getAllData();
  }, []);

  return (
    <>
      <div className={styles.item} style={{ marginTop: 20 }}>
        <span className={styles.value}>NFTP Copies has been updated below</span>
      </div>
      <div>{pieData.length > 0 && <Pie data={pieData} />}</div>
    </>
  );
};

export default App;
