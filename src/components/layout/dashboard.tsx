import { ReactElement, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Layout, Image, Space, Button } from 'antd';

import Header from '@/components/header';
import Sider from '@/components/sider/dashboardSider';
import SiderVisitor from '@/components/sider/dashboardSiderVisitor';
import Footer from '@/components/footer';

import { getSessionStorage } from '@/utils';
import sdk from 'hcstore/sdk';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setCurrentDAO,
  setCurrentMember,
  setDAOType,
  setUserMembers,
} from '@/store/features/daoSlice';
import { useRouter } from 'next/router';

// const Header = dynamic(() => import('@/components/header'), { ssr: false });

export default function BasicLayout({ children }: { children: ReactElement }) {
  const dispatch = useAppDispatch();
  const { address, chainId } = useAppSelector((store) => store.wallet);
  const { currentMember, DAOType } = useAppSelector((store) => store.dao);
  const router = useRouter();
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const dao = getSessionStorage('currentDAO');
      const type = localStorage.getItem('DAOType');

      if (!dao || !dao.address) {
        router.push('/');
        return;
      }

      dispatch(setCurrentDAO(dao));
      dispatch(setDAOType(type));

      if (type === 'join' || type === 'create') {
        const members = await sdk.utils.methods.getMembersFrom({
          chain: chainId,
          host: dao.host,
          owner: address,
        });

        if (members && members.length > 0) {
          dispatch(setUserMembers(members));
          dispatch(setCurrentMember(members[0]));
        }
      }

      setInit(true);
    };

    initData();
  }, []);

  // useEffect(() => {
  //   if (currentMember) {

  //   }
  // }, [currentMember]);

  if (!init) {
    return null;
  }
  console.log('DAOType', DAOType);

  return (
    <>
      <Head>
        <title>Smart DAO</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Layout hasSider>
        {(DAOType === 'join' || DAOType === 'create') && <Sider />}
        {(DAOType === 'follow' || DAOType === 'visitor') && <SiderVisitor />}
        <Layout>
          <Header />
          {children}
          <Footer />
        </Layout>
      </Layout>
    </>
  );
}