import { ReactElement, useEffect, useRef } from 'react';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { connectType as types } from '@/config/enum';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { setCookie } from '@/utils/cookie';
import {
  connectWallet,
  disconnect,
  setAddress,
  setChainId,
} from '@/store/features/walletSlice';
import { useRouter } from 'next/router';
import { Modal } from 'antd';

const App = ({ children, type }: { children: ReactElement; type?: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { address, connectType } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  const { isInit } = useAppSelector((store) => store.common);

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
  //           className: 'modal-small',
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

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default App;
