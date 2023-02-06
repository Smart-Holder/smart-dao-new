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
import { request, waitBlockNumber } from '@/api';
import { disconnect } from './walletSlice';

import { getContract, contractSend } from '@/utils/contract';
import { abi as DAOABI } from '@/config/abi/DAO.json';
// import { abi as DAOsABI } from '@/config/abi/DAOs.json';
import DAOs from '@/config/abi/DAOs.json';

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

export const deployAssetSalesDAO = createAsyncThunk(
  'dao/initDAO',
  async (params: any) => {
    const {
      web3,
      address,
      chain,
      operator,
      name,
      mission,
      description,
      memberBaseName,
      members,
      image,
      defaultVoteTime,
      assetIssuanceTax,
      assetCirculationTax,
    } = params;
    const contract = getContract(
      web3,
      DAOs.abi,
      process.env.NEXT_PUBLIC_DAOS_PROXY_ADDRESS,
    );
    const baseURI = `${process.env.VUE_APP_HCSTORE_URL}/utils/printJSON`;
    let addr = '';

    const res = await contractSend(
      contract,
      address,
      'deployAssetSalesDAO',
      [
        name,
        mission,
        description,
        operator,
        {
          // InitMemberArgs
          name: memberBaseName,
          description: memberBaseName,
          baseURI: baseURI,
          members: members.map((e: any) => {
            return {
              owner: e.owner,
              info: { ...e, image: image },
              permissions: [0xdc6b0b72, 0x678ea396],
            };
          }),
        },
        {
          //InitVotePoolArgs
          description: 'VotePool description',
          lifespan: Math.max(defaultVoteTime, 7 * 24 * 60 * 60 /*7 days*/),
        },
        {
          // InitLedgerArgs
          description: 'Ledger description',
        },
        {
          // InitAssetArgs
          name: name, // string  name;
          description: 'Asset description',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`,
          external_link: process.env.NEXT_PUBLIC_BASE_URL,
          seller_fee_basis_points_first: assetIssuanceTax, // 30%
          seller_fee_basis_points_second: assetCirculationTax, // 10%
          fee_recipient: '0x0000000000000000000000000000000000000000', // auto set
          contractURIPrefix: baseURI,
        },
      ],
      async (receipt) => {
        addr = await contract.methods.get(name).call();
        await waitBlockNumber(receipt.blockNumber, addr, chain, 2);
      },
    );

    console.log('init DAO success');

    return res;

    // let dao = await request({
    //   method: "getDAO",
    //   name: "utils",
    //   params: { chain, address: addr },
    // });

    // commit("SET_CURRENT_DAO", dao);
  },
);

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
      .addCase(deployAssetSalesDAO.pending, (state) => {
        console.log('deployAssetSalesDAO pending!');
      })
      .addCase(deployAssetSalesDAO.fulfilled, (state, { payload }) => {
        console.log('deployAssetSalesDAO fulfilled', payload);
        // state.DAOList = payload;
      })
      .addCase(deployAssetSalesDAO.rejected, (state, err) => {
        console.log('deployAssetSalesDAO rejected', err);
      })
      .addCase(getDAOList.pending, (state) => {
        console.log('getDAOList pending!');
      })
      .addCase(getDAOList.fulfilled, (state, { payload }) => {
        console.log('getDAOList fulfilled', payload);
        state.DAOList = payload;
      })
      .addCase(getDAOList.rejected, (state, err) => {
        console.log('getDAOList rejected', err);
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
