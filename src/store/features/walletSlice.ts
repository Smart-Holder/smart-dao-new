import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { increment } from './counterSlice';
import connector from '@/utils/connect';
// import { connect as connectMetaMask } from "@/utils/metamask";
import { connectType } from '@/config/enum';
import { getCookie, setCookie, clearCookie } from '@/utils/cookie';
import Web3 from 'web3';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { initialize as initApi } from '@/api';
import router from 'next/router';
import { formatAddress } from '@/utils';

export interface WalletState {
  web3: any;
  provider: any;
  connectType: number;
  isSupportChain: boolean;
  chainId: number;
  address: string;
  addressFormat: string;
  balance: number;
  currentChainInfo: any;
}
const initialState: WalletState = {
  web3: null,
  provider: undefined,
  connectType: Number(getCookie('connectType')),
  // connectType: 1,
  isSupportChain: false,
  chainId: 0,
  address: getCookie('address'),
  addressFormat: formatAddress(getCookie('address')),
  // address: '',
  balance: 0,
  currentChainInfo: {},
};

export const connectWallet = createAsyncThunk(
  'wallet/connectAsync',
  async (connectType: number) => {
    const res = await connector(connectType);
    // if (res) {
    //   const { chainId, address } = res;
    //   console.log('res', res);
    //   initApi(address, chainId);
    //   dispatch("setWallet", { address, chainId, connectType: type });
    // }
    return { ...res, connectType };

    // thunkApi.dispatch(walletSlice.actions.setConnectType(connectType));
    // return res;
  },
);

// 创建一个 Slice
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
      state.addressFormat = formatAddress(payload);
    },
    setChainId: (state, { payload }) => {
      state.chainId = payload;
      state.isSupportChain =
        !!payload && Object.keys(ETH_CHAINS_INFO).includes(payload.toString());

      if (state.isSupportChain && payload) {
        state.currentChainInfo = ETH_CHAINS_INFO[payload];
      } else {
        state.currentChainInfo = {};
      }
    },
    setBalance: (state, { payload }) => {
      state.balance = payload;
    },
    disconnect: (state) => {
      state.provider = undefined;
      state.connectType = 0;
      state.address = '';
      state.chainId = 0;
      state.balance = 0;
      state.web3 = null;
      clearCookie('address');
      clearCookie('chainId');
      clearCookie('connectType');
      localStorage.removeItem('step');
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
        const { provider, chainId, address, connectType } = payload;

        // initApi(address, chainId);

        setCookie('address', address, 30);
        setCookie('chainId', chainId, 30);
        setCookie('connectType', connectType, 30);

        state.provider = provider;
        state.web3 = new Web3(provider);
        state.address = address;
        state.chainId = Number(chainId);
        state.connectType = connectType;
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
  setBalance,
  disconnect,
} = walletSlice.actions;

// 默认导出
export default walletSlice.reducer;
