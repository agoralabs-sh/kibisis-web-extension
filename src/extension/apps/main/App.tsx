import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';

// Components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// Constants
import {
  ADD_ACCOUNT_ROUTE,
  ACCOUNTS_ROUTE,
  SETTINGS_ROUTE,
} from '@extension/constants';

// Features
import { reducer as accountsReducer } from '@extension/features/accounts';
import {
  reducer as applicationReducer,
  setSideBar,
} from '@extension/features/application';
import { reducer as assetsReducer } from '@extension/features/assets';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';

// Pages
import AccountPage from '@extension/pages/AccountPage';
import MainAddAccountRouter from '@extension/pages/MainAddAccountRouter';
import SettingsRouter from '@extension/pages/SettingsRouter';

// Types
import { IAppProps, IAppThunkDispatch, IMainRootState } from '@extension/types';

// Utils
import { makeStore } from '@extension/utils';

const createRouter = (dispatch: IAppThunkDispatch) =>
  createHashRouter([
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
          path: ACCOUNTS_ROUTE,
        },
        {
          element: <AccountPage />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${ACCOUNTS_ROUTE}/:address`,
        },
        {
          element: <MainAddAccountRouter />,
          loader: () => {
            dispatch(setSideBar(false));

            return null;
          },
          path: `${ADD_ACCOUNT_ROUTE}/*`,
        },
        {
          element: <SettingsRouter />,
          loader: () => {
            dispatch(setSideBar(true));

            return null;
          },
          path: `${SETTINGS_ROUTE}/*`,
        },
      ],
      element: <Root />,
      path: '/',
    },
  ]);

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      application: applicationReducer,
      assets: assetsReducer,
      messages: messagesReducer,
      networks: networksReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <RouterProvider router={createRouter(store.dispatch)} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
