import { Layout as AntdLayout } from 'antd';
import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';

import DAOList from '@/containers/home/daoList';

const App: NextPageWithLayout = () => {
  return (
    <AntdLayout.Content className={styles['content-home']}>
      <div>
        <div className={styles.title1}>
          Welcome! Discovery the hole magic worlds !
        </div>
        <div className={styles.title2}>Welcome to SmartDAO</div>
      </div>
      <div className={styles.box} id="scrollableDiv">
        <DAOList />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
