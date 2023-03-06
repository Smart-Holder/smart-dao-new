import { useEffect, useState } from 'react';
import { Modal } from 'antd';

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
  const { provider, connectType, address, chainId, isSupportChain } =
    useAppSelector((store) => store.wallet);

  const [init, setInit] = useState(false);

  // 有 connectType，没有 provider，先连接钱包
  useEffect(() => {
    const type = Number(getCookie('connectType'));

    if (type && isSupportChain && !provider) {
      dispatch(connectWallet(type));
      setInit(true);
    }
  }, [connectType, isSupportChain]);

  // useEffect(() => {
  //   if (init && !address && chainId && connectType) {
  //     dispatch(connectWallet(connectType));
  //   }
  // }, [chainId]);

  useEffect(() => {
    if (!isSupportChain) {
      Modal.warning({
        title: `Supported networks: Ethereum, Goerli`,
        className: 'modal-small',
        onOk: () => {
          dispatch({ type: 'wallet/notSupportChain', payload: null });
        },
      });
    }
  }, [isSupportChain]);

  return <>{props.children}</>;
};

export default App;
