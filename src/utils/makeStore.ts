import {
  configureStore,
  combineReducers,
  Store,
  Reducer,
} from '@reduxjs/toolkit';

// Features
import {
  reducer as applicationReducer,
  setError,
  setToast,
} from '../features/application';
import { reducer as registerReducer } from '../features/register';

// Types
import { IRootState } from '../types';

export default function makeStore(): Store<IRootState> {
  const reducer: Reducer<IRootState> = combineReducers<IRootState>({
    application: applicationReducer,
    register: registerReducer,
  });

  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [setError.type, setToast.type],
          ignoredPaths: [
            'application.error',
            'application.logger.debug',
            'application.logger.error',
            'application.logger.info',
            'application.logger.warn',
            'application.toast',
          ],
        },
      }),
    reducer,
  });
}
