import router from 'next/router';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Web3 from 'web3';
// import { Modal } from 'antd';

import { connectType } from '@/config/enum';
import { ETH_CHAINS_INFO } from '@/config/chains';

import connector from '@/utils/connect';
import { setCookie, clearCookie } from '@/utils/cookie';

export interface WalletState {
  web3: any;
  provider: any;
  connectType: number;
  isSupportChain: boolean;
  chainId: number;
  address: string;
}

const initialState: WalletState = {
  web3: null,
  provider: undefined,
  connectType: 0,
  isSupportChain: true,
  chainId: 0,
  address: '',
};

export const connectWallet = createAsyncThunk(
  'wallet/connectAsync',
  async (connectType: number, { dispatch }) => {
    const res = await connector(connectType, dispatch);
    return { ...res, connectType };
  },
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setProvider: (state, { payload }) => {
      state.provider = payload;
      state.web3 = new Web3(payload);
    },
    setConnectType: (state, { payload }) => {
      if (payload === connectType.MetaMask) {
        state.connectType = connectType.MetaMask;
      } else if (payload === connectType.WalletConnect) {
        state.connectType = connectType.WalletConnect;
      }
    },
    setAddress: (state, { payload }) => {
      state.address = payload;
    },
    setChainId: (state, { payload }) => {
      state.chainId = payload;
      state.isSupportChain =
        !!payload && Object.keys(ETH_CHAINS_INFO).includes(payload.toString());
    },
    setSupportChain: (state, { payload }) => {
      state.isSupportChain = payload;
    },
    disconnect: (state) => {
      state.provider = undefined;
      state.connectType = 0;
      state.address = '';
      state.chainId = 0;
      state.isSupportChain = true;
      state.web3 = null;
      clearCookie('address');
      clearCookie('chainId');
      clearCookie('connectType');
      localStorage.removeItem('step');
      localStorage.removeItem('walletconnect');
      sessionStorage.clear();
      router.push('/');
    },
    notSupportChain: (state) => {
      state.provider = undefined;
      state.address = '';
      // state.chainId = 0;
      // state.isSupportChain = true;
      state.web3 = null;
      clearCookie('address');
      // clearCookie('chainId');
      localStorage.removeItem('step');
      localStorage.removeItem('walletconnect');
      sessionStorage.clear();
      router.push('/');
    },
  },
  // extraReducers 字段让 slice 处理在别处定义的 actions，
  // 包括由 createAsyncThunk 或其他slice生成的actions。
  extraReducers(builder) {
    builder
      .addCase(connectWallet.fulfilled, (state, { payload }) => {
        console.log('connect fulfilled', payload);
        const { provider, chainId, address, connectType: type } = payload;

        if (!chainId) {
          return;
        }

        const isSupport = Object.keys(ETH_CHAINS_INFO).includes(chainId);

        if (!isSupport) {
          state.isSupportChain = false;
          // Modal.warning({
          //   title: 'Supported networks: Ethereum, Goerli',
          // });
          return;
        }

        setCookie('address', address, 30);
        setCookie('chainId', chainId, 30);
        setCookie('connectType', type, 30);

        state.provider = provider;
        state.web3 = new Web3(provider);
        state.address = address;
        state.chainId = Number(chainId);
        state.isSupportChain = true;
        state.connectType = type;
      })
      .addCase(connectWallet.rejected, (state, err) => {
        console.log('connect rejected', err);
      });
  },
});

// 导出方法
export const {
  setProvider,
  setConnectType,
  setAddress,
  setChainId,
  disconnect,
  notSupportChain,
  setSupportChain,
} = walletSlice.actions;

// 默认导出
export default walletSlice.reducer;
