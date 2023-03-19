import dynamic from 'next/dynamic';

import Layout from '@/components/layout';
import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

import styles from '@/styles/content.module.css';
import { useIntl } from 'react-intl';

const Setting = dynamic(() => import('@/containers/launch/setting'), {
  ssr: false,
});

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      {/* <div className={styles['basic-title1']}>
        {formatMessage({ id: 'home.welcome' })}
      </div>
      <div className={styles['basic-title2']}>
        {formatMessage({ id: 'home.createOwnDAO' })}
      </div> */}
      <div className={styles.box} style={{ padding: '68px 55px' }}>
        <Setting />
      </div>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="launch">{page}</Layout>;

export default App;
