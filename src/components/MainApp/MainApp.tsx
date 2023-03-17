import { ChakraProvider } from '@chakra-ui/react';
import { combineReducers, Store } from '@reduxjs/toolkit';
import { i18n } from 'i18next';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Components
import MainAppProvider from '../MainAppProvider';
import Fonts from '../Fonts';

// Constants
import { ACCOUNTS_ROUTE } from '../../constants';

// Features
import { reducer as accountsReducer } from '../../features/accounts';
import { reducer as applicationReducer } from '../../features/application';

// Pages
import AccountPage from '../../pages/AccountPage';

// Theme
import { theme } from '../../theme';

// Types
import { IMainRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

interface IProps {
  i18next: i18n;
}

const MainApp: FC<IProps> = ({ i18next }: IProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      application: applicationReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ChakraProvider theme={theme}>
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
              </Routes>
            </MainAppProvider>
          </HashRouter>
        </ChakraProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default MainApp;
