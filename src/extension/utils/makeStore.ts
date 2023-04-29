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
            'application.confirm.onCancel',
            'application.confirm.onConfirm',
            'application.error',
            'application.logger.debug',
            'application.logger.error',
            'application.logger.info',
            'application.logger.warn',
            'application.navigate',
            'application.toast',
          ],
        },
      }),
    reducer,
  });
}
