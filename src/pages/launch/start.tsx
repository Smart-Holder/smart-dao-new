import dynamic from 'next/dynamic';
import { Layout as AntdLayout } from 'antd';
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
    <div className="start">
      <div className={styles['basic-title1']}>
        {formatMessage({ id: 'home.welcome' })}
      </div>
      <div className={styles['basic-title2']}>
        {formatMessage({ id: 'home.createOwnDAO' })}
      </div>

      <div className={styles.box}>
        <Start />
      </div>

      <style jsx>
        {`
          .start {
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
            max-width: var(--width);
            padding: 0 54px;
            margin: 0 auto;
          }
        `}
      </style>
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
