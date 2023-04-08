import { createSlice } from '@reduxjs/toolkit';
import { disconnect } from './walletSlice';

import { User } from '@/config/define';

export interface UserState {
  userInfo: User;
}

const initialState: UserState = {
  userInfo: {
    id: 0,
    nickname: '',
    description: '',
    image: '',
    likes: 0,
    address: '',
    time: 0,
    modify: 0,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }) => {
      state.userInfo = { ...payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(disconnect, (state) => {
      console.log('disconnect extraReducer: clear userInfo');
      state.userInfo = { ...initialState.userInfo };
    });
  },
});

// 导出方法
export const { setUserInfo } = userSlice.actions;

// 默认导出
export default userSlice.reducer;
