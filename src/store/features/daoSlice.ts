import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { increment } from './counterSlice';
// import connector from '@/utils/connect';
// import { connect as connectMetaMask } from "@/utils/metamask";
// import { connectType } from '@/config/enum';
// import { getCookie, setCookie, clearCookie } from '@/utils/cookie';
// import Web3 from 'web3';
// import { ETH_CHAINS_INFO } from '@/config/chains';
// import { initialize as initApi } from '@/api';
import sdk from 'hcstore/sdk';
// import { getSessionStorage } from '@/utils';
import { request, waitBlockNumber } from '@/api';
import { disconnect } from './walletSlice';

import { getContract, contractSend } from '@/utils/contract';
// import { abi as DAOABI } from '@/config/abi/DAO.json';
// import { abi as DAOsABI } from '@/config/abi/DAOs.json';
import DAOs from '@/config/abi/DAOs.json';
import { clearMakeDAOStorage } from '@/utils/launch';

import router from 'next/router';

export interface DAOState {
  DAOType: string; // create/join/follow/visitor
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
  DAOType: '',
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
    const {
      web3,
      address,
      chain,
      name,
      mission,
      description,
      memberBaseName,
      members,
      image,
      assetIssuanceTax,
      assetCirculationTax,
      defaultVoteRate,
      defaultVotePassRate,
      executor,
      hours,
    } = params;
    const contract = getContract(
      web3,
      DAOs.abi,
      process.env.NEXT_PUBLIC_DAOS_PROXY_ADDRESS,
    );
    const baseURI = `${process.env.NEXT_PUBLIC_BASE_URL}/service-api/utils/printJSON`;
    let addr = '';

    const param = [
      {
        name,
        mission,
        description,
        image,
      },
      address,
      {
        // InitMemberArgs
        name: memberBaseName,
        description: memberBaseName,
        baseURI: baseURI,
        members: members.map((e: any) => {
          return {
            owner: e.owner,
            info: { ...e, image: '' },
            permissions: [0xdc6b0b72, 0x678ea396],
          };
        }),
        executor,
      },
      {
        //InitVotePoolArgs
        description: 'VotePool description',
        lifespan: Math.max(hours, 7 * 24 /*7 days*/) * 60 * 60,
      },
      {
        // InitLedgerArgs
        description: 'Ledger description',
      },
      {
        // InitAssetArgs
        name: name, // string  name;
        description: 'Asset description',
        image: image,
        external_link: process.env.NEXT_PUBLIC_BASE_URL,
        seller_fee_basis_points_first: assetIssuanceTax * 100, // 30%
        seller_fee_basis_points_second: assetCirculationTax * 100, // 10%
        fee_recipient: '0x0000000000000000000000000000000000000000', // auto set
        contractURIPrefix: baseURI,
      },
    ];

    const res = await contractSend(
      contract,
      address,
      'deployAssetSalesDAO',
      param,
      async (receipt) => {
        addr = await contract.methods.get(name).call();
        await waitBlockNumber(receipt.blockNumber, addr, chain, 2);
      },
    );

    console.log('init DAO success');

    const currentDAO = await sdk.utils.methods.getDAO({ chain, address: addr });

    return currentDAO;

    // let dao = await request({
    //   method: "getDAO",
    //   name: "utils",
    //   params: { chain, address: addr },
    // });

    // commit("SET_CURRENT_DAO", dao);
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
    setDAOType: (state, { payload }) => {
      state.DAOType = payload;
      localStorage.setItem('DAOType', payload);
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
        state.DAOType = '';
      })
      .addCase(deployAssetSalesDAO.pending, (state) => {
        console.log('deployAssetSalesDAO pending!');
      })
      .addCase(deployAssetSalesDAO.fulfilled, (state, { payload }) => {
        console.log('deployAssetSalesDAO fulfilled. currentDAO: ', payload);
        clearMakeDAOStorage();
        state.step = 0;
        state.currentDAO = payload;
        state.DAOType = 'create';
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
