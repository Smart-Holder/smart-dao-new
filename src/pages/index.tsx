import { Layout } from 'antd';

import BasicLayout from '@/components/layout/basic';
import styles from '@/styles/content.module.css';

import DAOList from '@/containers/home/daoList';

const { Content } = Layout;

export default function Home() {
  return (
    <BasicLayout>
      <Content className={styles.content}>
        <div>
          <div className={styles.title1}>
            Welcome! Discovery the hole magic worlds !
          </div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        {/* <div className={`${styles.box} ${styles['box-scroll']}`}> */}
        <div className={styles.box}>
          <DAOList />
        </div>
      </Content>
    </BasicLayout>
  );
}
