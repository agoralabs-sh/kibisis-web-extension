import { configureStore, Store, Reducer } from '@reduxjs/toolkit';

// features
import {
  setConfirm,
  setError,
  setNavigate,
  setToast,
} from '@extension/features/system';
import { initializeWalletConnectThunk } from '@extension/features/sessions';

// types
import { IBaseRootState } from '@extension/types';

export default function makeStore<T extends IBaseRootState>(
  reducer: Reducer<T>
): Store<T> {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            initializeWalletConnectThunk.fulfilled.type,
            setConfirm.type,
            setError.type,
            setNavigate.type,
            setToast.type,
          ],
          ignoredPaths: [
            'sessions.web3Wallet',
            'system.confirm.onCancel',
            'system.confirm.onConfirm',
            'system.error',
            'system.logger.debug',
            'system.logger.error',
            'system.logger.info',
            'system.logger.warn',
            'system.navigate',
            'system.toast',
          ],
        },
      }),
    reducer,
  });
}
