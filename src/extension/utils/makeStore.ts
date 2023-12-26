import { configureStore, Store, Reducer } from '@reduxjs/toolkit';

// types
import { IBaseRootState } from '@extension/types';

export default function makeStore<T extends IBaseRootState>(
  reducer: Reducer<T>
): Store<T> {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
    reducer,
  });
}
