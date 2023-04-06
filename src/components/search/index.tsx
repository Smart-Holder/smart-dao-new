import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Image, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { setSearchText } from '@/store/features/commonSlice';
import { useAppDispatch } from '@/store/hooks';

import { useIntl } from 'react-intl';

// import type { InputRef } from 'antd';

// 有搜索框的页面
const searchList = [
  '/',
  '/daos',
  '/nfts',
  // '/dashboard/mine/assets',
  // '/dashboard/mine/order',
  // '/dashboard/mine/income',
  // '/dashboard/governance/votes',
  // '/dashboard/financial/assets',
  // '/dashboard/financial/order',
  // '/dashboard/financial/income',
  // '/dashboard/member/nftp',
];

const Search: React.FC = () => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const inputRef = useRef<InputRef>(null);

  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState() as any;
  // let timer: any;

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);

      // debounceSearch();

      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          dispatch(setSearchText(e.target.value));
        }, 1000),
      );
    },
    [dispatch, timer],
  );

  // const setSearchState = () => {
  //   dispatch(setSearchText(v));
  // };

  // const debounceSearch = useCallback(debounce(setSearchState, 1000), []);

  // useEffect(() => {
  //   return () => {
  //     dispatch(setSearchText(''));
  //   };
  // }, []);

  useEffect(() => {
    if (searchList.includes(router.pathname)) {
      setValue('');
      dispatch(setSearchText(''));
      setShow(true);
    } else {
      setShow(false);
    }
  }, [router]);

  if (!show) {
    return null;
  }

  return (
    <div className="input-wrap">
      <Input
        // id="abc"
        value={value}
        className="search-input"
        placeholder={formatMessage({ id: 'search' })}
        autoComplete="off"
        allowClear
        prefix={
          // <SearchOutlined
          //   style={{ fontSize: 24, color: '#a3a3a3', marginRight: 14 }}
          // />
          <Image
            src="/images/header/icon_navi_top_search@2x.png"
            width={18}
            height={18}
            alt=""
            preview={false}
          />
        }
        // onChange={debounceSearch}
        onChange={onChange}
      />
      <style jsx>
        {`
          .input-wrap {
            display: flex;
            width: 100%;
          }

          .input-wrap :global(.search-input) {
            width: 100%;
            height: 46px;
            padding-left: 20px;
            padding-right: 20px;

            font-size: 15px;
            color: #969ba0;

            background-color: #f3f3f3;
            border: 0;
            border-radius: 23px;
            box-shadow: none;
          }

          .input-wrap
            :global(.ant-input-affix-wrapper.search-input .ant-input-prefix) {
            margin-inline-end: 22px;
          }

          .input-wrap :global(input) {
            background-color: #f3f3f3;
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(Search);
