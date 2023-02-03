import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sdk from 'hcstore/sdk';

export interface QiniuState {
  qiniuImgUrl: string;
  qiniuUploadUrl: string;
  token: string;
}
const initialState: QiniuState = {
  qiniuImgUrl: process.env.NEXT_PUBLIC_QINIU_IMG_URL || '',
  qiniuUploadUrl: process.env.NEXT_PUBLIC_QINIU_UPLOAD_URL || '',
  token: '',
};

export const getQiniuToken = createAsyncThunk('qiniu/getQiniu', async () => {
  return sdk.utils.methods.qiniuToken();
});

// 创建一个 Slice
export const qiniuSlice = createSlice({
  name: 'qiniu',
  initialState,
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getQiniuToken.fulfilled, (state, { payload }) => {
        console.log('getQiniuToken fulfilled', payload);
        state.token = payload;
      })
      .addCase(getQiniuToken.rejected, (state, err) => {
        console.log('getQiniuToken rejected', err);
      });
  },
});

// 导出方法
export const { setToken } = qiniuSlice.actions;

// 默认导出
export default qiniuSlice.reducer;
