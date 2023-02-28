import { ReactElement, useEffect, useRef } from 'react';

import BasicLayout from './basic';
import LaunchLayout from './launch';
import DashboardLayout from './dashboard';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { connectType as types } from '@/config/enum';
import { setCookie } from '@/utils/cookie';
import { setAddress, setChainId } from '@/store/features/walletSlice';
import { useRouter } from 'next/router';

const App = ({ children, type }: { children: ReactElement; type?: string }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { address, connectType } = useAppSelector((store) => store.wallet);
  const { currentDAO } = useAppSelector((store) => store.dao);

  useEffect(() => {
    if (!address) {
      return;
    }

    if (connectType === types.MetaMask) {
      window.ethereum.on('chainChanged', (res: number) => {
        console.log('-----chain changed-----', res);
        setCookie('chainId', Number(res), 30);
        dispatch(setChainId(Number(res)));
        // window.location.reload();
        router.push('/');
      });

      window.ethereum.on('accountsChanged', (res: string[]) => {
        console.log('-----accounts changed-----', res);
        setCookie('address', res[0], 30);
        dispatch(setAddress(res[0]));
        // window.location.reload();
        router.push('/');
      });
    }
  }, [address]);

  if (type === 'basic') {
    return <BasicLayout>{children}</BasicLayout>;
  } else if (type === 'launch') {
    return <LaunchLayout>{children}</LaunchLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default App;
