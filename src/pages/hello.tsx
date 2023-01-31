import { connectWallet } from '@/store/features/walletSlice';
import { getMovieData } from '@/store/features/movieSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

import { Button, Radio } from 'antd';

function HelloWorld() {
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>Hello</p>
      <p>a:{process.env.NEXT_PUBLIC_HCSTORE_URL}</p>
      <Button type="primary">Button</Button>
      <Radio>Radio</Radio>
      <button
        onClick={() => {
          dispatch(connectWallet(1));
        }}
      >
        connect
      </button>
      <style jsx>{`
        p {
          color: black;
        }
        div {
          background: white;
        }
      `}</style>
      <style global jsx>{`
        body {
          background: black;
        }
      `}</style>
    </div>
  );
}

export default HelloWorld;
