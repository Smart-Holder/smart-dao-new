import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';

import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

export const languageList = ['en', 'ja'];

const antdLocales: { [index: string]: any } = {
  en: enUS,
  ja: jaJP,
};

const messagesList: { [index: string]: any } = {
  en,
  ja,
};

// const getBrowserLanguage = () => {
//   if (typeof window !== 'undefined') {
//     return window.navigator.language.substring(0, 2);
//   }

//   return undefined;
// };

// const getLanguageConfig = (lang?: string) => {
//   let language = lang || getBrowserLanguage() || 'en';

//   return {
//     locale: language,
//     messages: messagesList[language],
//     antdLocale: antdLocales[language],
//   };
// };

const getLanguageConfig = (lang = 'en') => {
  return {
    locale: lang,
    messages: messagesList[lang],
    antdLocale: antdLocales[lang],
  };
};

export default getLanguageConfig;
