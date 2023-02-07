import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { disconnect } from './walletSlice';
// import sdk from 'hcstore/sdk';

// import { connectWallet } from './walletSlice';

export interface UserState {
  userInfo: {
    id: number; //                int primary key,
    nickname: string; //          varchar (24)                 not null,
    description: string; //       varchar (512)                not null,
    image: string; //             varchar (512)                not null,
    likes: number; //             int           default (0)    not null,
    address: string; //           varchar (42)                 not null,  -- wallet address
    time: number; //              bigint                       not null,
    modify: number; //            bigint                       not null
  };
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

// export const getUser = createAsyncThunk('user/getUserData', async () => {
//   return sdk.user.methods.getUser();
// });

// 创建一个 Slice
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
      console.log('disconnect extraReducer: delete user');
      state.userInfo = { ...initialState.userInfo };
    });
    // .addCase(getUser.fulfilled, (state, { payload }) => {
    //   console.log('getUser fulfilled', payload);
    //   state.userInfo = { ...payload };
    //   // state.id = payload.id;
    //   // state.nickname = payload.nickname;
    //   // state.description = payload.description;
    //   // state.image = payload.image;
    //   // state.likes = payload.likes;
    //   // state.address = payload.address;
    //   // state.time = payload.time;
    //   // state.modify = payload.modify;
    // })
    // .addCase(getUser.rejected, (state, err) => {
    //   console.log('getUser rejected', err);
    // });
  },
});

// 导出方法
export const { setUserInfo } = userSlice.actions;

// 默认导出
export default userSlice.reducer;
