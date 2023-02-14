import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { setSearchText } from '@/store/features/commonSlice';
import { useAppDispatch } from '@/store/hooks';

import { debounce } from '@/utils';

// import type { InputRef } from 'antd';

// 有搜索框的页面
const searchList = [
  '/',
  '/dashboard/mine/assets',
  '/dashboard/mine/order',
  '/dashboard/mine/income',
  '/dashboard/governance/votes',
  '/dashboard/financial/assets',
  '/dashboard/financial/order',
  '/dashboard/financial/income',
  '/dashboard/member/nftp',
];

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // const inputRef = useRef<InputRef>(null);

  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const [timer, setTimer] = useState() as any;
  // let timer: any;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    // debounceSearch();

    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        dispatch(setSearchText(e.target.value));
      }, 1000),
    );
  };

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
        id="abc"
        value={value}
        className="search-input"
        placeholder="input search text"
        autoComplete="off"
        allowClear
        suffix={<SearchOutlined style={{ fontSize: 24, color: '#a3a3a3' }} />}
        // onChange={debounceSearch}
        onChange={onChange}
      />
      <style jsx>
        {`
          .input-wrap {
            display: inline-flex;
          }
          .input-wrap :global(.search-input) {
            width: 466px;
            height: 46px;
            font-size: 14px;

            color: #969ba0;
            background-color: #fcfcfc;
            border: 1px solid #eaeaea;
          }
        `}
      </style>
    </div>
  );
};

export default Search;
