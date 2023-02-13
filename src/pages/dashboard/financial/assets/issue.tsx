import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import IssueForm from '@/containers/dashboard/financial/issue-form';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['dashboard-content']}>
      <div className={styles['dashboard-content-body']}>
        <div className={styles['financial-issue']}>
          <div className={styles['financial-issue-title']}>发行资产</div>
          <div className={styles['financial-issue-sub-title']}>
            Lorem ipsum dolor sit amet, consectetur
          </div>
          <IssueForm />
        </div>
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;

export default App;
