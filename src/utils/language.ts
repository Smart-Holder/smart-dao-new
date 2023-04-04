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

/**
 * 设置字体
 * 英文，mac 系统使用 SFUIText, 标题等大号字体使用 Times New Roman
 * 英文，windows 系统使用 Arial, 标题等大号字体使用 Times New Roman
 * 日文，mac 系统使用 Hiragino Sans, 标题等大号字体使用 Hiragino Mincho ProN
 * 日文，windows 系统使用 MS Gothic, 标题等大号字体使用 MS Mincho
 * @param lang
 */
const setFont = (lang = 'en') => {
  document.documentElement.style.setProperty(
    '--font-family-400',
    `var(--font-family-${lang}-400)`,
  );
  document.documentElement.style.setProperty(
    '--font-family-500',
    `var(--font-family-${lang}-500)`,
  );
  document.documentElement.style.setProperty(
    '--font-family-600',
    `var(--font-family-${lang}-600)`,
  );
  document.documentElement.style.setProperty(
    '--font-family-700',
    `var(--font-family-${lang}-700)`,
  );
  document.documentElement.style.setProperty(
    '--font-family-lg',
    `var(--font-family-${lang}-lg)`,
  );
};

const getLanguageConfig = (lang = 'en') => {
  setFont(lang);

  return {
    locale: lang,
    messages: messagesList[lang],
    antdLocale: antdLocales[lang],
  };
};

export default getLanguageConfig;
