import React, { useState, useEffect } from 'react';
import { Avatar, Dropdown, Image } from 'antd';
import type { MenuProps } from 'antd';
import Img from 'next/image';

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
  en: '/images/header/icon_navi_top_language_defult.png',
  ja: '/images/header/icon_navi_top_language_defult.png',
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
        {/* <Space className="dropdown-trigger" size={3} align="center">
          <GlobalOutlined style={{ fontSize: 22, verticalAlign: 'middle' }} />
          <span className="dropdown-trigger-content">{langLabel}</span>
          <DownOutlined />
        </Space> */}

        <Image
          src={icons[lang]}
          width={26}
          height={20}
          alt="language"
          preview={false}
        />
      </Dropdown>

      <style jsx>
        {`
          .wrap {
            margin-right: 55px;
          }

          .wrap :global(.ant-image) {
            line-height: 0;
          }
        `}
      </style>
    </div>
  );
};

export default Lang;
