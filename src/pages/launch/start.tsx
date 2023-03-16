import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';

const Start = dynamic(() => import('@/containers/launch/start'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div className={styles['basic-title1']}>
        {formatMessage({ id: 'home.welcome' })}
      </div>
      <div className={styles['basic-title2']}>
        {formatMessage({ id: 'home.createOwnDAO' })}
      </div>

      <div className={styles.box}>
        <Start />
      </div>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
