import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import {
  createHashRouter,
  Navigate,
  redirect,
  RouterProvider,
} from 'react-router-dom';

// components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// constants
import {
  ACCOUNTS_ROUTE,
  ADD_ACCOUNT_ROUTE,
  ASSETS_ROUTE,
  NFTS_ROUTE,
  SETTINGS_ROUTE,
  PASSWORD_LOCK_ROUTE,
  TRANSACTIONS_ROUTE,
} from '@extension/constants';

// features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as addAssetReducer } from '@extension/features/add-asset';
import { reducer as arc0072AssetsReducer } from '@extension/features/arc0072-assets';
import { reducer as arc200AssetsReducer } from '@extension/features/arc0200-assets';
import { reducer as eventsReducer } from '@extension/features/events';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as notificationsReducer } from '@extension/features/notifications';
import { reducer as passwordLockReducer } from '@extension/features/password-lock';
import { reducer as sendAssetsReducer } from '@extension/features/send-assets';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import {
  fetchSettingsFromStorageThunk,
  reducer as settingsReducer,
} from '@extension/features/settings';
import { reducer as standardAssetsReducer } from '@extension/features/standard-assets';
import {
  reducer as systemReducer,
  setSideBar,
} from '@extension/features/system';

// pages
import AccountPage from '@extension/pages/AccountPage';
import AssetPage from '@extension/pages/AssetPage';
import LoadingPage from '@extension/pages/LoadingPage';
import NFTPage from '@extension/pages/NFTPage';
import PasswordLockPage from '@extension/pages/PasswordLockPage';
import TransactionPage from '@extension/pages/TransactionPage';

// routers
import AddAccountRouter from '@extension/routers/AddAccountMainRouter';
import SettingsRouter from '@extension/routers/SettingsRouter';

// types
import type { ILogger } from '@common/types';
import type {
  IAppProps,
  IAppThunkDispatch,
  IMainRootState,
  ISettings,
} from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';

const createRouter = ({ dispatch, getState }: Store<IMainRootState>) => {
  const _functionName: string = 'createRouter';
  const logger: ILogger = getState().system.logger;

  return createHashRouter([
    {
      children: [
        {
          children: [
            {
              element: <Navigate replace={true} to={ACCOUNTS_ROUTE} />,
              path: '/',
            },
            {
              element: <AccountPage />,
              loader: () => {
                dispatch(setSideBar(true));

                return null;
              },
              path: `${ACCOUNTS_ROUTE}/*`,
            },
            {
              element: <AddAccountRouter />,
              loader: () => {
                dispatch(setSideBar(false));

                return null;
              },
              path: `${ADD_ACCOUNT_ROUTE}/*`,
            },
            {
              element: <AssetPage />,
              loader: () => {
                dispatch(setSideBar(true));

                return null;
              },
              path: `${ASSETS_ROUTE}/:assetId`,
            },
            {
              element: <NFTPage />,
              loader: () => {
                dispatch(setSideBar(true));

                return null;
              },
              path: `${NFTS_ROUTE}/:appId/:tokenId`,
            },
            {
              element: <SettingsRouter />,
              loader: () => {
                dispatch(setSideBar(true));

                return null;
              },
              path: `${SETTINGS_ROUTE}/*`,
            },
            {
              element: <TransactionPage />,
              loader: () => {
                dispatch(setSideBar(true));

                return null;
              },
              path: `${TRANSACTIONS_ROUTE}/:transactionId`,
            },
          ],
          element: <Root />,
          loader: async () => {
            let password: string | null;
            let settings: ISettings;

            try {
              settings = await (dispatch as IAppThunkDispatch)(
                fetchSettingsFromStorageThunk()
              ).unwrap(); // fetch the settings from storage
              password = getState().passwordLock.password;

              // if the password lock is on, we need the password
              if (settings.security.enablePasswordLock && !password) {
                return redirect(PASSWORD_LOCK_ROUTE);
              }
            } catch (error) {
              logger.debug(`${_functionName}: failed to get settings`);
            }

            return null;
          },
          path: '/',
        },
        {
          element: <PasswordLockPage />,
          path: `${PASSWORD_LOCK_ROUTE}/*`,
        },
      ],
      path: '/',
    },
  ]);
};

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      addAsset: addAssetReducer,
      arc0072Assets: arc0072AssetsReducer,
      arc0200Assets: arc200AssetsReducer,
      events: eventsReducer,
      messages: messagesReducer,
      networks: networksReducer,
      notifications: notificationsReducer,
      passwordLock: passwordLockReducer,
      sendAssets: sendAssetsReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      standardAssets: standardAssetsReducer,
      system: systemReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <RouterProvider
            fallbackElement={<LoadingPage />}
            router={createRouter(store)}
          />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
