import React from 'react';
import { Layout } from 'antd';

import Menu from '@/components/sider/dashboardSiderMenu';
import InfoDAO from '@/components/sider/infoDAO';
import InfoRole from '@/components/sider/infoRole';

const App = () => {
  return (
    <Layout.Sider
      width="298"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        height: '100vh',
        padding: '76px 32px 0',
        backgroundColor: 'white',
        borderRight: '1px solid #f5f5f5',
      }}
    >
      <InfoDAO />
      <Menu />
      <InfoRole />
    </Layout.Sider>
  );
};

export default React.memo(App);
