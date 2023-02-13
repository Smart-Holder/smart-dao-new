import { Space } from 'antd';

import { useAppDispatch } from '@/store/hooks';
import { nextStep, resetStep } from '@/store/features/daoSlice';

import { setMakeDAOStorage } from '@/utils/launch';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useAppDispatch();

  const handleClick1 = () => {
    setMakeDAOStorage('template', { type: 'DAO' });
    dispatch(nextStep());
  };

  const handleClick2 = () => {
    setMakeDAOStorage('template', { type: 'DAO' });
    dispatch(nextStep());
  };

  return (
    <Space size={70} wrap>
      <div className="item" onClick={handleClick1}>
        <div className="h1">Titles: SST 01</div>
        <div>
          <div className="text">
            This was not just great cooking but exceptional cooking using only
            the best ingredients.
            <br />
            <br />
            Fast, professional and friendly service, we ordered the six course
            tasting menu and every dish was spectacular
          </div>
        </div>
      </div>
      <div className="item">
        <div className="h1">Titles: SST 02</div>
        <div>
          <div className="text">
            This was not just great cooking but exceptional cooking using only
            the best ingredients.
            <br />
            <br />
            Fast, professional and friendly service, we ordered the six course
            tasting menu and every dish was spectacular
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .item {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 380px;
            height: 414px;
            padding: 32px 38px;
            background: #546ff6;
            border-radius: 14px;
            cursor: pointer;
          }

          .h1 {
            height: 42px;
            font-size: 22px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 42px;
          }

          .text {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 26px;
          }
        `}
      </style>
    </Space>
  );
};

export default App;
