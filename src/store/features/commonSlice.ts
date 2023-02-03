import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface QiniuState {
  loading: boolean;
  searchText: string;
}
const initialState: QiniuState = {
  loading: false,
  searchText: '',
};

export const CommonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading = payload;
    },
    setSearchText: (state, { payload }) => {
      state.searchText = payload;
    },
  },
});

export const { setLoading, setSearchText } = CommonSlice.actions;

export default CommonSlice.reducer;
