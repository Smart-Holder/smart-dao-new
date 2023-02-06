import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import sdk from 'hcstore/sdk';

import { initialize } from '@/api';
import { getCookie, setCookie } from '@/utils/cookie';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setIsInit, setLang } from '@/store/features/commonSlice';
// import {
//   setAddress,
//   setChainId,
//   setConnectType,
// } from '@/store/features/walletSlice';

import getLanguageConfig, { languageList } from '@/utils/language';
import { setUserInfo } from '@/store/features/userSlice';

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
  const { lang, isInit } = useAppSelector((store) => store.common);
  const { address, chainId } = useAppSelector((store) => store.wallet);
  const [init, setInit] = useState(false);

  // init api
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await initialize();

        setInit(true);

        // const token = await sdk.utils.methods.qiniuToken();

        // if (token) {
        //   setCookie('qiniuToken', token);
        // }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // 连接钱包后，init api, qiniu and user
  useEffect(() => {
    const init = async () => {
      try {
        const res1 = await initialize(address);
        const token = await sdk.utils.methods.qiniuToken();

        if (token) {
          setCookie('qiniuToken', token);
        }

        const userRes = await sdk.user.methods.getUser();

        if (userRes && userRes.nickname) {
          dispatch(setUserInfo(userRes));
        }

        dispatch(setIsInit(true));
      } catch (error) {
        console.error(error);
      }
    };

    if (address && chainId) {
      init();
    }
  }, [address, chainId]);

  if (!init) {
    return null;
  }

  return <>{props.children}</>;
};

export default App;
