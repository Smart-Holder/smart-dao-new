import React, { ChangeEvent, useEffect, useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

import { setSearchText } from '@/store/features/commonSlice';
import { useAppDispatch } from '@/store/hooks';

import { debounce } from '@/utils';

// 有搜索框的页面
const searchList = ['/', '/dashboard/member/nftp'];

const Search: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [show, setShow] = useState(false);

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('searchText:', e.target.value);
    dispatch(setSearchText(e.target.value));
  };

  const debounceSearch = debounce(onSearch, 1000);

  useEffect(() => {
    return () => {
      dispatch(setSearchText(''));
    };
  }, []);

  useEffect(() => {
    if (searchList.includes(router.pathname)) {
      setShow(true);
    }
  }, [router]);

  if (!show) {
    return null;
  }

  return (
    <div className="input-wrap">
      <Input
        className="search-input"
        placeholder="input search text"
        allowClear
        suffix={<SearchOutlined style={{ fontSize: 24, color: '#a3a3a3' }} />}
        onChange={debounceSearch}
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
