import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Components
import MainAppProvider from '../MainAppProvider';
import Fonts from '../Fonts';
import ThemeProvider from '../ThemeProvider';

// Constants
import { ACCOUNTS_ROUTE, SETTINGS_ROUTE } from '../../constants';

// Features
import { reducer as accountsReducer } from '../../features/accounts';
import { reducer as applicationReducer } from '../../features/application';
import { reducer as networksReducer } from '../../features/networks';
import { reducer as sessionsReducer } from '../../features/sessions';
import { reducer as settingsReducer } from '../../features/settings';

// Pages
import AccountPage from '../../pages/AccountPage';
import SettingsRouter from '../../pages/SettingsRouter';

// Types
import { IAppProps, IMainRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

const MainApp: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      application: applicationReducer,
      networks: networksReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <Fonts />
          <HashRouter>
            <MainAppProvider>
              <Routes>
                <Route
                  element={<Navigate replace={true} to={ACCOUNTS_ROUTE} />}
                  path="/"
                />
                <Route
                  element={<AccountPage />}
                  path={`${ACCOUNTS_ROUTE}/:address`}
                />
                <Route element={<AccountPage />} path={ACCOUNTS_ROUTE} />
                <Route
                  element={<SettingsRouter />}
                  path={`${SETTINGS_ROUTE}/*`}
                />
              </Routes>
            </MainAppProvider>
          </HashRouter>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default MainApp;
