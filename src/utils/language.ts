import enUS from 'antd/locale/en_US';
import jaJP from 'antd/locale/ja_JP';

import en from '@/locales/en.json';
import ja from '@/locales/ja.json';

import store from '../store';

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

export function getMessage(tag: string) {
  const { lang } = store.getState().common;
  const list = tag in messagesList ? messagesList[lang] : messagesList.en;
  return (list[tag] || tag) as string;
}

const getLanguageConfig = (lang = 'en') => {
  return {
    locale: lang,
    messages: messagesList[lang],
    antdLocale: antdLocales[lang],
  };
};

export default getLanguageConfig;
