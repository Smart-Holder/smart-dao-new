import React, { useState, useEffect } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLang } from '@/store/features/commonSlice';

const langList: MenuProps['items'] = [
  {
    label: 'English',
    key: 'en',
  },
  { label: '日本語', key: 'ja' },
];

const icons: { [index: string]: string } = {
  en: '/images/header/icon_navi_top_language_defult@2x.png',
  ja: '/images/header/icon_navi_top_language_defult@2x.png',
};

const hoverIcons: { [index: string]: string } = {
  en: '/images/header/icon_navi_top_language_hover@2x.png',
  ja: '/images/header/icon_navi_top_language_hover@2x.png',
};

const Lang = () => {
  const { lang } = useAppSelector((store) => store.common);
  const dispatch = useAppDispatch();
  const [langLabel, setLangLabel] = useState('');

  // useEffect(() => {
  //   const l = localStorage.getItem('lang');

  //   if (l) {
  //     dispatch(setLang(l));
  //   }
  // }, []);

  useEffect(() => {
    if (lang) {
      const l = langList.find((item) => item?.key === lang) as any;
      setLangLabel(l.label);
    }
  }, [lang]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    dispatch(setLang(key));
    // localStorage.setItem('lang', key);
  };

  return (
    <div className="wrap">
      <Dropdown
        menu={{ items: langList, onClick: handleMenuClick }}
        trigger={['click']}
        overlayClassName="language-menu"
      >
        <div className="language-trigger">
          <span className="language-icon" />
        </div>
        {/* <Image
          src={icons[lang]}
          width={26}
          height={20}
          alt="language"
          preview={false}
        /> */}
      </Dropdown>

      <style jsx>
        {`
          .wrap {
            margin-right: 55px;
          }

          .wrap :global(.ant-image) {
            line-height: 0;
          }

          .language-trigger {
            display: flex;
            align-items: center;
            height: 32px;
            line-height: 0;
          }

          .language-icon {
            display: inline-block;
            width: 26px;
            height: 20px;
            vertical-align: middle;
            background: url(${icons[lang]}) no-repeat center;
            background-size: cover;
            cursor: pointer;
          }

          .language-icon:hover {
            background-image: url(${hoverIcons[lang]});
          }
        `}
      </style>
    </div>
  );
};

export default Lang;
