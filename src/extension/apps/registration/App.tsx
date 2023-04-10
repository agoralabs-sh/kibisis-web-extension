import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Components
import Fonts from '@extension/components/Fonts';
import ThemeProvider from '@extension/components/ThemeProvider';
import AppProvider from './AppProvider';

// Constants
import {
  ACCOUNT_SETUP_ROUTE,
  CREATE_NEW_ACCOUNT_ROUTE,
  CREATE_PASSWORD_ROUTE,
  GET_STARTED_ROUTE,
  IMPORT_ACCOUNT_ROUTE,
} from '@extension/constants';

// Features
import { reducer as applicationReducer } from '@extension/features/application';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as registrationReducer } from '@extension/features/registration';

// Pages
import AccountSetupPage from '@extension/pages/AccountSetupPage';
import CreateNewAccountPage from '@extension/pages/CreateNewAccountPage';
import CreatePasswordPage from '@extension/pages/CreatePasswordPage';
import GetStartedPage from '@extension/pages/GetStartedPage';
import ImportNewAccountPage from '@extension/pages/ImportNewAccountPage';

// Types
import { IAppProps, IRegistrationRootState } from '@extension/types';

// Utils
import { makeStore } from '@extension/utils';

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IRegistrationRootState> =
    makeStore<IRegistrationRootState>(
      combineReducers({
        application: applicationReducer,
        networks: networksReducer,
        settings: settingsReducer,
        registration: registrationReducer,
      })
    );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <Fonts />
          <HashRouter>
            <AppProvider>
              <Routes>
                <Route
                  element={<Navigate replace={true} to={GET_STARTED_ROUTE} />}
                  path="/"
                />
                <Route element={<GetStartedPage />} path={GET_STARTED_ROUTE} />
                <Route
                  element={<CreatePasswordPage />}
                  path={CREATE_PASSWORD_ROUTE}
                />
                <Route
                  element={<AccountSetupPage />}
                  path={ACCOUNT_SETUP_ROUTE}
                />
                <Route
                  element={<CreateNewAccountPage />}
                  path={CREATE_NEW_ACCOUNT_ROUTE}
                />
                <Route
                  element={<ImportNewAccountPage />}
                  path={IMPORT_ACCOUNT_ROUTE}
                />
              </Routes>
            </AppProvider>
          </HashRouter>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
