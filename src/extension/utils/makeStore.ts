import { configureStore, Store, Reducer } from '@reduxjs/toolkit';

// Features
import {
  setConfirm,
  setError,
  setNavigate,
  setToast,
} from '@extension/features/system';

// Types
import { IBaseRootState } from '@extension/types';

export default function makeStore<T extends IBaseRootState>(
  reducer: Reducer<T>
): Store<T> {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            setConfirm.type,
            setError.type,
            setNavigate.type,
            setToast.type,
          ],
          ignoredPaths: [
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
