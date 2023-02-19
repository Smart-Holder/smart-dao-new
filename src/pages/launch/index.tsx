import { Layout as AntdLayout } from 'antd';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import Index from '@/containers/launch';

import styles from '@/styles/content.module.css';
import { useIntl } from 'react-intl';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <AntdLayout.Content className={styles['launch-content']}>
      <div>
        <div className={styles.title1}>
          {formatMessage({ id: 'home.welcome' })}
        </div>
        <div className={styles.title2}>
          {formatMessage({ id: 'home.createOwnDAO' })}
        </div>
      </div>
      <div className={styles.box}>
        <Index />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
