import { useIntl } from 'react-intl';

import styles from '@/styles/content.module.css';

import Mine from '@/containers/mine';
import Layout from '@/components/layout';

import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <div>
      <div>
        <div className={styles['basic-title1']}>
          {formatMessage({ id: 'home.welcome' })}
        </div>
        <div className={styles['basic-title2']}>
          {formatMessage({ id: 'home.createOwnDAO' })}
        </div>
      </div>

      <Mine />
    </div>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
