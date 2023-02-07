import React, { useState, MouseEvent, createRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Layout, Dropdown, Space } from 'antd';
import { DownOutlined, GlobalOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setLang } from '@/store/features/commonSlice';

import { getCookie } from '@/utils/cookie';

const langList: MenuProps['items'] = [
  {
    label: 'English',
    key: 'en',
  },
  { label: '日本語', key: 'ja' },
];

const Lang = () => {
  const router = useRouter();
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
      >
        <Space className="dropdown-trigger" size={3} align="center">
          <GlobalOutlined style={{ fontSize: 22, verticalAlign: 'middle' }} />
          <span className="dropdown-trigger-content">{langLabel}</span>
          <DownOutlined />
        </Space>
      </Dropdown>
      <style jsx>
        {`
          .wrap :global(.dropdown-trigger) {
            height: 46px;
            padding: 0 12px 0 7px;
            color: #3e4954;
            font-size: 14px;
            line-height: 46px;
            background: #f9faff;
            border-radius: 23px;
            cursor: pointer;
          }

          .wrap :global(.dropdown-trigger-content) {
            padding: 0 10px 0 4px;
          }
        `}
      </style>
    </div>
  );
};

export default Lang;
