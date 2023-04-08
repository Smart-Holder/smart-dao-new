import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { disconnect } from './walletSlice';

import { request } from '@/api';
import { DAOType } from '@/config/enum';
export interface DAOState {
  daoType: DAOType;
  currentDAO: any;
  currentMember: any;
  step: number;
}
const initialState: DAOState = {
  daoType: DAOType.Visit,
  currentDAO: { name: '' },
  currentMember: { name: '' },
  step: 0,
};

export const getDAO = createAsyncThunk(
  'dao/getDAO_',
  async ({ chain, address }: { chain: number; address: string }) => {
    const res = await request({
      method: 'getDAO',
      name: 'utils',
      params: { chain, address },
    });

    return res;
  },
);

export const DAOSlice = createSlice({
  name: 'dao',
  initialState,
  reducers: {
    setDAOType: (state, { payload }: { payload: DAOType }) => {
      state.daoType = payload;
      localStorage.setItem('daoType', payload);
    },
    setCurrentDAO: (state, { payload }) => {
      state.currentDAO = payload;

      if (payload) {
        sessionStorage.setItem('currentDAO', JSON.stringify(payload));
      }
    },
    setCurrentMember: (state, { payload }) => {
      state.currentMember = payload;
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
    resetStep: (state) => {
      state.step = 0;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(disconnect, (state) => {
        console.log('disconnect extraReducer: delete dao');
        state.currentDAO = { name: '' };
        state.daoType = DAOType.Visit;
        localStorage.setItem('daoType', DAOType.Visit);
      })
      .addCase(getDAO.fulfilled, (state, { payload }) => {
        console.log('getDAO fulfilled', payload);
        state.currentDAO = payload;
        sessionStorage.setItem('currentDAO', JSON.stringify(payload));
      })
      .addCase(getDAO.rejected, (state, err) => {
        console.log('getDAO rejected', err);
      });
  },
});

// 导出方法
export const {
  setDAOType,
  setCurrentDAO,
  setCurrentMember,
  setStep,
  nextStep,
  prevStep,
  resetStep,
} = DAOSlice.actions;

// 默认导出
export default DAOSlice.reducer;
