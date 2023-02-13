import { Layout } from 'antd';

import BasicLayout from '@/components/layout/basic';
import styles from '@/styles/content.module.css';

import DAOList from '@/containers/home/daoList';

const { Content } = Layout;

export default function Home() {
  return (
    <BasicLayout>
      <Content className={styles['content-home']}>
        <div>
          <div className={styles.title1}>
            Welcome! Discovery the hole magic worlds !
          </div>
          <div className={styles.title2}>Welcome to SmartDAO</div>
        </div>
        {/* <div className={styles.space}></div> */}
        <div className={styles.box} id="scrollableDiv">
          <DAOList />
        </div>
        {/* <div className={styles.space2}></div> */}
      </Content>
    </BasicLayout>
  );
}
