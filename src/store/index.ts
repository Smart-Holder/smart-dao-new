import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import commonSlice from './features/commonSlice';
import counterSlice from './features/counterSlice';
import movieSlice from './features/movieSlice';
import walletSlice from './features/walletSlice';
import daoSlice from './features/daoSlice';
import userSlice from './features/userSlice';

// configureStore创建一个redux数据
const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ['wallet/setProvider', 'wallet/provider'],
      // }
      serializableCheck: false,
    }),
  // 合并多个Slice
  reducer: {
    counter: counterSlice, // test
    movie: movieSlice, // test async
    common: commonSlice,
    wallet: walletSlice,
    dao: daoSlice,
    user: userSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
