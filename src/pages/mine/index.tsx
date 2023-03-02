import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useIntl } from 'react-intl';
import { Layout as AntdLayout } from 'antd';

import styles from '@/styles/content.module.css';

import Mine from '@/containers/mine';
import Layout from '@/components/layout';

import type { ReactElement } from 'react';
import type { NextPageWithLayout } from '@/pages/_app';

const App: NextPageWithLayout = () => {
  const { formatMessage } = useIntl();

  return (
    <AntdLayout.Content className={styles.content}>
      <div>
        <div className={styles.title1}>
          {formatMessage({ id: 'home.welcome' })}
        </div>
        <div className={styles.title2}>
          {formatMessage({ id: 'home.createOwnDAO' })}
        </div>
      </div>
      <div className={styles.box}>
        <Mine />
      </div>
    </AntdLayout.Content>
  );
};

App.getLayout = (page: ReactElement) => <Layout type="basic">{page}</Layout>;

export default App;
