import dynamic from 'next/dynamic';
import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import { useIntl } from 'react-intl';

const Information = dynamic(() => import('@/containers/launch/information'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <AntdLayout.Content className={styles['launch-content']}>
      <div className={styles.title1}>
        {formatMessage({ id: 'home.welcome' })}
      </div>
      <div className={styles.title2}>
        {formatMessage({ id: 'home.createOwnDAO' })}
      </div>
      <div className={styles.box}>
        <Information />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
