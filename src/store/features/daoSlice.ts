import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { increment } from './counterSlice';
import connector from '@/utils/connect';
// import { connect as connectMetaMask } from "@/utils/metamask";
import { connectType } from '@/config/enum';
import { getCookie, setCookie, clearCookie } from '@/utils/cookie';
import Web3 from 'web3';
import { ETH_CHAINS_INFO } from '@/config/chains';
import { initialize as initApi } from '@/api';
import { getSessionStorage } from '@/utils';
import { request } from '@/api';
import { disconnect } from './walletSlice';

export interface DAOState {
  currentDAO: any;
  DAOList: Array<any>;
  step: number;
  launch: number;
}
const initialState: DAOState = {
  currentDAO: getSessionStorage('currentDAO') || { name: '' },
  DAOList: [],
  // step: Number(localStorage.getItem('step')) || 0,
  step: 0,
  launch: 0,
};

export const getDAOList = createAsyncThunk(
  'dao/getDAO',
  async ({ chain, owner }: { chain: number; owner: string }) => {
    const res = await request({
      method: 'getDAOsFromOwner',
      name: 'utils',
      params: { chain, owner },
    });

    return res;
  },
);

export const DAOSlice = createSlice({
  name: 'dao',
  initialState,
  reducers: {
    setDAOList: (state, { payload }) => {
      state.DAOList = payload;
    },
    setCurrentDAO: (state, { payload }) => {
      state.currentDAO = payload;

      if (payload) {
        sessionStorage.setItem('currentDAO', JSON.stringify(payload));
      }
    },
    setStep: (state, { payload }) => {
      state.step = payload;
      localStorage.setItem('step', payload);
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    nextStep: (state) => {
      state.step += 1;
    },
    setLaunch: (state, { payload }) => {
      state.launch = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(disconnect, (state) => {
        console.log('disconnect extraReducer: delete dao');
        state.DAOList = [];
        state.currentDAO = { name: '' };
      })
      .addCase(getDAOList.pending, (state) => {
        console.log('connect pending!');
      })
      .addCase(getDAOList.fulfilled, (state, { payload }) => {
        console.log('connect fulfilled', payload);
        state.DAOList = payload;
      })
      .addCase(getDAOList.rejected, (state, err) => {
        console.log('connect rejected', err);
      });
  },
});

// 导出方法
export const {
  setDAOList,
  setCurrentDAO,
  setStep,
  nextStep,
  prevStep,
  setLaunch,
} = DAOSlice.actions;

// 默认导出
export default DAOSlice.reducer;
