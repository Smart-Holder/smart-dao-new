import { Layout, Table, Button, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

import DashboardLayout from '@/components/layout/dashboard';

import styles from './styles.module.css';
import contentStyles from '@/styles/content.module.css';
import Counts from './components/counts';
import Filters from './components/filters';
import { useState } from 'react';

const Order = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDone = () => {};

  return (
    <>
      <DashboardLayout>
        <Layout.Content className={contentStyles['dashboard-content']}>
          <div className={styles['assets-header']}>
            <Counts
              items={[
                { num: 12456, title: 'All Acounts' },
                { num: 31232, title: 'All Acounts' },
                { num: 31232, title: 'All Acounts' },
                { num: 31232, title: 'All Acounts' },
              ]}
            />
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              分配
            </Button>
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
      <Modal
        width={512}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className={styles['modal-content']}>
          <div className={styles['modal-title']}>分配收益并自动提交提案</div>
          <div className={styles['modal-subtitle']}>
            Create your own DAO in a few minutes!
          </div>
          <Button
            type="primary"
            className={styles['modal-button']}
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default Order;
