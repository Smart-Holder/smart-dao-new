import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface CommonState {
  lang: string;
  loading: boolean;
  loadingTimer: number | null;
  searchText: string;
}
const initialState: CommonState = {
  // lang: localStorage.getItem('lang') || 'en',
  lang: '',
  loading: false,
  loadingTimer: null,
  searchText: '',
};

export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLang: (state, { payload }) => {
      state.lang = payload;
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
});

export const { setLang, setLoading, setLoadingTimer, setSearchText } =
  CommonSlice.actions;

export default CommonSlice.reducer;
