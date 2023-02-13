import { Layout, MenuProps, Space, Select, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import DashboardLayout from '@/components/layout/dashboard';
import styles from '@/styles/content.module.css';
import Counts from '@/containers/dashboard/mine/counts';
import Filters from '@/containers/dashboard/mine/filters';

const Assets = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={styles['dashboard-content']}>
        <div className={styles['dashboard-content-header']}>
          <Counts
            items={[
              { num: 12456, title: 'All Acounts' },
              { num: 31232, title: 'All Acounts' },
            ]}
          />
          <Filters />
        </div>
        <div className={styles['dashboard-content-body']}>
          <Table
            className={styles['dashboard-content-table']}
            pagination={{ position: ['bottomRight'] }}
            rowKey="order"
            columns={[
              { title: '订单', dataIndex: 'order', key: 'order' },
              { title: '市场', dataIndex: 'market', key: 'market' },
              { title: '金额', dataIndex: 'price', key: 'price' },
              { title: '标签', dataIndex: 'tag', key: 'tag' },
              { title: '发送方', dataIndex: 'from', key: 'from' },
              { title: 'Date', dataIndex: 'date', key: 'date' },
              { key: 'action', render: () => <EllipsisOutlined /> },
            ]}
            dataSource={[
              {
                order: '#5552351',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552352',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552353',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552354',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552355',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
            ]}
          />
        </div>
      </Layout.Content>
    </DashboardLayout>
  );
};

export default Assets;
