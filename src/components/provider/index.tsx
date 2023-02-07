import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import sdk from 'hcstore/sdk';

import { initialize } from '@/api';
import { getCookie, setCookie } from '@/utils/cookie';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLang } from '@/store/features/commonSlice';
// import {
//   setAddress,
//   setChainId,
//   setConnectType,
// } from '@/store/features/walletSlice';

import getLanguageConfig, { languageList } from '@/utils/language';

const theme = {
  token: {
    colorPrimary: '#546FF6',
  },
  components: {
    Button: {
      colorPrimary: '#2F4CDD',
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
  const { lang } = useAppSelector((store) => store.common);
  const { address, chainId } = useAppSelector((store) => store.wallet);
  const [languageConfig, setConfig] = useState({}) as any;

  // 如果 store 中没有 address, chainId 等信息, 尝试从 cookie 中获取
  // useEffect(() => {
  //   if (!address) {
  //     const addr = getCookie('address');
  //     const chain = getCookie('chainId');
  //     const type = getCookie('connectType');

  //     if (addr) {
  //       dispatch(setAddress(addr));
  //     }

  //     if (chain) {
  //       dispatch(setChainId(chain));
  //     }

  //     if (type) {
  //       dispatch(setConnectType(type));
  //     }
  //   }
  // }, []);

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

  // init language
  useEffect(() => {
    if (!lang) {
      let l = window?.navigator.language.substring(0, 2);
      l = languageList.includes(l) ? l : 'en';

      dispatch(setLang(l));
    }
  }, []);

  // language change
  useEffect(() => {
    if (lang) {
      setConfig(getLanguageConfig(lang));
    }
  }, [lang]);

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

  console.log('language:', languageConfig.locale);

  if (!languageConfig.locale) {
    return null;
  }

  return (
    <IntlProvider
      locale={languageConfig.locale}
      messages={languageConfig.messages}
      defaultLocale="en"
    >
      <ConfigProvider theme={theme} locale={languageConfig.antdLocale}>
        {props.children}
      </ConfigProvider>
    </IntlProvider>
  );
};

export default App;
