import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import counterSlice from './features/counterSlice';
import movieSlice from './features/movieSlice';
import walletSlice from './features/walletSlice';
import daoSlice from './features/daoSlice';

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
    counter: counterSlice,
    movie: movieSlice, // test async
    wallet: walletSlice,
    dao: daoSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
