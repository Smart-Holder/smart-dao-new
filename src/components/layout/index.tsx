import { ReactElement, useEffect } from 'react';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { useRouter } from 'next/router';
import { getSessionStorage } from '@/utils';
import { DAOType } from '@/config/enum';

const visitablePage = [
  '/dashboard/mine/home',
  '/dashboard/governance/votes',
  '/dashboard/financial/assets',
  '/dashboard/financial/order',
  '/dashboard/financial/income',
  '/dashboard/member/nftp',
];

const App = ({
  children,
  type,
  footer,
}: {
  children: ReactElement;
  type?: string;
  footer?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { address, connectType } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const { isInit } = useAppSelector((store) => store.common);

  useEffect(() => {
    if (type === 'basic' || type === 'layout') {
      return;
    }

    const dao = getSessionStorage('currentDAO');
    let daoType = localStorage.getItem('daoType');

    if (!dao || !dao.address) {
      router.replace('/');
      return;
    }

    if (daoType === DAOType.Visit || daoType === DAOType.Follow) {
      const { pathname } = router;
      const visitable = visitablePage.some((path) => pathname.includes(path));

      if (!visitable) {
        router.replace('/dashboard/mine/home');
        return;
      }
    }
  }, [router]);

  if (router.pathname !== '/' && !isInit) {
    return null;
  }

  // useEffect(() => {
  //   if (!address) {
  //     return;
  //   }

  //   if (connectType === types.MetaMask) {
  //     window.ethereum.on('chainChanged', (res: number) => {
  //       console.log('-----chain changed-----', res);
  //       const chainId = Number(res);

  //       const isSupport = Object.keys(ETH_CHAINS_INFO).includes(
  //         chainId.toString(),
  //       );

  //       if (isSupport) {
  //         setCookie('chainId', chainId, 30);
  //         dispatch(setChainId(chainId));
  //         // window.location.reload();
  //         router.push('/');

  //         // dispatch(connectWallet(types.MetaMask));

  //         // if (router.pathname === '/') {
  //         //   router.reload();
  //         // } else {
  //         //   router.push('/');
  //         // }
  //       } else {
  //         Modal.warning({
  //           title: `Supported networks: Ethereum, Goerli`,
  //           onOk: () => {
  //             dispatch(disconnect());
  //           },
  //         });
  //       }
  //     });

  //     window.ethereum.on('accountsChanged', (res: string[]) => {
  //       console.log('-----accounts changed-----', res);
  //       setCookie('address', res[0], 30);
  //       dispatch(setAddress(res[0]));
  //       // window.location.reload();
  //       router.push('/');
  //     });
  //   }
  // }, [address]);

  if (type === 'basic') {
    return <BasicLayout>{children}</BasicLayout>;
  } else if (type === 'launch') {
    return <LaunchLayout>{children}</LaunchLayout>;
  }

  return <DashboardLayout footer={footer}>{children}</DashboardLayout>;
};

export default App;
