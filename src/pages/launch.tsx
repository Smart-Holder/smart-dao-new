import Head from 'next/head';
import { Layout } from 'antd';

import BasicLayout from '@/components/layout/basic';
import Form from '@/components/launch/form';
import styles from '@/styles/content.module.css';

const { Content } = Layout;

export default function Launch() {
  return (
    <BasicLayout>
      <Content className={styles.content}>
        <div>
          <div className={styles.title1}>
            Welcome! Discovery the hole magic worlds !
          </div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        <div className={styles.box}>
          <Form />
        </div>
      </Content>
    </BasicLayout>
  );
}
