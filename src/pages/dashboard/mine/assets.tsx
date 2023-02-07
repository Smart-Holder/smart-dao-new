import { Layout, MenuProps, Space, Select, Table } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import DashboardLayout from '@/components/layout/dashboard';
import contentStyles from '@/styles/content.module.css';

import styles from './styles.module.css';
import Counts from './components/counts';
import Filters from './components/filters';

const Assets = () => {
  return (
    <DashboardLayout>
      <Layout.Content className={contentStyles['dashboard-content']}>
        <div className={styles['assets-header']}>
          <Counts
            items={[
              { num: 12456, title: 'All Acounts' },
              { num: 31232, title: 'All Acounts' },
            ]}
          />
          <Filters />
        </div>
        <div className={styles['assets-body']}>
          <Table
            className={styles['assets-table']}
            pagination={{ position: ['bottomRight'] }}
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
                order: '#5552351',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552351',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552351',
                market: '26 March 2020, 12:42 AM',
                price: 'James WItcwicky',
                tag: 'Corner Street 5th London',
                from: '$164.52',
                date: '11/12/2023',
              },
              {
                order: '#5552351',
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
