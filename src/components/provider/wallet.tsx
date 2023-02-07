import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import sdk from 'hcstore/sdk';

import { initialize } from '@/api';
import { getCookie, setCookie } from '@/utils/cookie';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
// import { setIsInit, setLang } from '@/store/features/commonSlice';
// import {
//   setAddress,
//   setChainId,
//   setConnectType,
// } from '@/store/features/walletSlice';

import getLanguageConfig, { languageList } from '@/utils/language';
import { connectWallet } from '@/store/features/walletSlice';

const theme = {
  token: {
    colorPrimary: '#546FF6',
  },
  components: {
    Button: {
      // colorPrimary: '#2F4CDD',
    },
  },
};

/**
 * react-intl 和 antd 的全局配置
 * @param props
 * @returns
 */
const App = (props: any) => {
  const dispatch = useAppDispatch();
  const { address, chainId, provider, connectType } = useAppSelector(
    (store) => store.wallet,
  );

  // init api and get qiniu token
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const res1 = await initialize();

  //       setInit(true);

  //       const token = await sdk.utils.methods.qiniuToken();

  //       if (token) {
  //         setCookie('qiniuToken', token);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   init();
  // }, []);

  // 连接钱包后，再次 init api
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const res1 = await initialize();
  //       dispatch(setIsInit(true));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   if (address && chainId) {
  //     init();
  //   }
  // }, [address, chainId]);

  // 有 connectType，没有 provider，先连接钱包
  useEffect(() => {
    const type = Number(getCookie('connectType'));

    if (type && !provider) {
      dispatch(connectWallet(type));
    }
  }, []);

  // if (address && provider) {
  //   return null;
  // }

  return <>{props.children}</>;
};

export default App;
