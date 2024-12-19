import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '@/redux/slices/users-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: false
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];