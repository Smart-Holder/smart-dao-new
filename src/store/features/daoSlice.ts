import router from 'next/router';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { disconnect } from './walletSlice';

import { request } from '@/api';
import { createDAO } from '@/api/dao';

import { clearMakeDAOStorage } from '@/utils/launch';
import { DAOType } from '@/config/enum';
export interface DAOState {
  daoType: DAOType; // create/join/follow/visit
  currentDAO: any;
  DAOList: Array<any>;
  currentMember: any;
  userMembers: Array<any>;
  step: number;
  launch: number;
  likeDAOs: Array<any>;
  joinDAOs: Array<any>;
}
const initialState: DAOState = {
  daoType: DAOType.Visit,
  // currentDAO: getSessionStorage('currentDAO') || { name: '' },
  currentDAO: { name: '' },
  DAOList: [],
  currentMember: { name: '' },
  userMembers: [], // 当前用户的所有成员（所有身份）
  // step: Number(localStorage.getItem('step')) || 0,
  step: 0,
  launch: 0,
  likeDAOs: [],
  joinDAOs: [],
};

export const deployAssetSalesDAO = createAsyncThunk(
  'dao/initDAO',
  async (params: any) => {
    const currentDAO = await createDAO(params);
    return currentDAO;
  },
);

export const getDAOList = createAsyncThunk(
  'dao/getDAOList_',
  async ({ chain, owner }: { chain: number; owner: string }) => {
    const res = await request({
      method: 'getDAOsFromOwner',
      name: 'utils',
      params: { chain, owner },
    });

    return res;
  },
);

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
    setDAOList: (state, { payload }) => {
      state.DAOList = payload;
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
    setUserMembers: (state, { payload }) => {
      state.userMembers = payload;
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
    setLaunch: (state, { payload }) => {
      state.launch = payload;
    },
    setLikeDAOs: (state, { payload }) => {
      state.likeDAOs = payload;
    },
    setJoinDAOs: (state, { payload }) => {
      state.joinDAOs = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(disconnect, (state) => {
        console.log('disconnect extraReducer: delete dao');
        state.DAOList = [];
        state.currentDAO = { name: '' };
        state.daoType = DAOType.Visit;
      })
      .addCase(deployAssetSalesDAO.pending, (state) => {
        console.log('deployAssetSalesDAO pending!');
      })
      .addCase(deployAssetSalesDAO.fulfilled, (state, { payload }) => {
        console.log('deployAssetSalesDAO fulfilled. currentDAO: ', payload);
        clearMakeDAOStorage();
        state.step = 0;
        state.currentDAO = payload;
        state.daoType = DAOType.Join;
        sessionStorage.setItem('currentDAO', JSON.stringify(payload));
        router.push('/dashboard/mine/home');
        // state.DAOList = payload;
      })
      .addCase(deployAssetSalesDAO.rejected, (state, err) => {
        console.log('deployAssetSalesDAO rejected', err);
      })
      .addCase(getDAOList.fulfilled, (state, { payload }) => {
        console.log('getDAOList fulfilled', payload);
        state.DAOList = payload;
      })
      .addCase(getDAOList.rejected, (state, err) => {
        console.log('getDAOList rejected', err);
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
  setDAOList,
  setCurrentDAO,
  setStep,
  nextStep,
  prevStep,
  resetStep,
  setLaunch,
  setCurrentMember,
  setUserMembers,
  setLikeDAOs,
  setJoinDAOs,
} = DAOSlice.actions;

// 默认导出
export default DAOSlice.reducer;
