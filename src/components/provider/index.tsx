import { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLang } from '@/store/features/commonSlice';

import getLanguageConfig, { languageList } from '@/utils/language';

const theme = {
  token: {
    colorPrimary: '#000',
  },
  components: {
    Button: {
      // colorPrimary: '#2c2c2c',
    },
    // Input: {
    //   controlHeight: 40,
    //   borderRadius: 2,
    //   colorBorder: '#000',
    //   colorBgContainer: 'rgba(255,255,255,0.6)',
    // },
    // Select: {
    //   controlHeight: 40,
    //   borderRadius: 2,
    //   colorBorder: '#000',
    //   colorBgContainer: 'rgba(255,255,255,0.6)',
    // },
    // DatePicker: {
    //   controlHeight: 40,
    //   borderRadius: 2,
    //   colorBorder: '#000',
    //   colorBgContainer: 'rgba(255,255,255,0.6)',
    // },
  },
};

/**
 * 国际化 和 antd 的全局配置
 * @param props
 * @returns
 */
const App = (props: any) => {
  const dispatch = useAppDispatch();
  const { lang } = useAppSelector((store) => store.common);
  const [languageConfig, setConfig] = useState({}) as any;

  // init language
  useEffect(() => {
    if (!lang) {
      let l = window?.navigator.language.substring(0, 2);
      l = languageList.includes(l) ? l : 'en';

      console.log('language init:', languageConfig.locale);
      dispatch(setLang(l));
      setConfig(getLanguageConfig(l));
    }
  }, []);

  // language change
  useEffect(() => {
    if (lang && lang !== languageConfig.locale) {
      setConfig(getLanguageConfig(lang));
    }
  }, [lang]);

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
