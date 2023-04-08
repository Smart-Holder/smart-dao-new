import { createSlice } from '@reduxjs/toolkit';
import { disconnect } from './walletSlice';

export interface CommonState {
  isInit: boolean; // init api, qiniu and user. '/provider/api.tsx'
  lang: string;
  loading: boolean;
  loadingTimer: number | null;
  searchText: string;
}

const initialState: CommonState = {
  isInit: false,
  lang: '',
  loading: false,
  loadingTimer: null,
  searchText: '',
};

export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setIsInit: (state, { payload }) => {
      state.isInit = payload;
    },
    setLang: (state, { payload }) => {
      state.lang = payload;
      localStorage.setItem('lang', payload);
    },
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setLoadingTimer: (state, { payload }) => {
      state.loadingTimer = payload;
    },
    setSearchText: (state, { payload }) => {
      state.searchText = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(disconnect, (state) => {
      console.log('disconnect extraReducer: delete isInit');
      state.isInit = false;
    });
  },
});

export const {
  setIsInit,
  setLang,
  setLoading,
  setLoadingTimer,
  setSearchText,
} = CommonSlice.actions;

export default CommonSlice.reducer;
