import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { connectWallet } from '@/store/features/walletSlice';

import { getCookie } from '@/utils/cookie';

/**
 * 连接钱包
 * @param props
 * @returns
 */
const App = (props: any) => {
  const dispatch = useAppDispatch();
  const { provider } = useAppSelector((store) => store.wallet);

  // 有 connectType，没有 provider，先连接钱包
  useEffect(() => {
    const type = Number(getCookie('connectType'));

    if (type && !provider) {
      dispatch(connectWallet(type));
    }
  }, []);

  return <>{props.children}</>;
};

export default App;
