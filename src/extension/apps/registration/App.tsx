import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';

// components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// constants
import {
  ADD_ACCOUNT_ROUTE,
  CREATE_PASSWORD_ROUTE,
  GET_STARTED_ROUTE,
} from '@extension/constants';

// features
import { reducer as arc200AssetsReducer } from '@extension/features/arc0200-assets';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as notificationsReducer } from '@extension/features/notifications';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as registrationReducer } from '@extension/features/registration';
import { reducer as systemReducer } from '@extension/features/system';

// pages
import CreatePasswordPage from '@extension/pages/CreatePasswordPage';
import GetStartedPage from '@extension/pages/GetStartedPage';

// routers
import AddAccountRouter from '@extension/routers/AddAccountRegistrationRouter';

// types
import type { IAppProps, IRegistrationRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';

const createRouter = () =>
  createHashRouter([
    {
      children: [
        {
          element: <Navigate replace={true} to={GET_STARTED_ROUTE} />,
          path: '/',
        },
        {
          element: <GetStartedPage />,
          path: GET_STARTED_ROUTE,
        },
        {
          element: <CreatePasswordPage />,
          path: CREATE_PASSWORD_ROUTE,
        },
        {
          element: <AddAccountRouter />,
          path: `${ADD_ACCOUNT_ROUTE}/*`,
        },
      ],
      element: <Root />,
      path: '/',
    },
  ]);

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IRegistrationRootState> =
    makeStore<IRegistrationRootState>(
      combineReducers({
        arc0200Assets: arc200AssetsReducer,
        networks: networksReducer,
        notifications: notificationsReducer,
        settings: settingsReducer,
        registration: registrationReducer,
        system: systemReducer,
      })
    );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <RouterProvider router={createRouter()} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
