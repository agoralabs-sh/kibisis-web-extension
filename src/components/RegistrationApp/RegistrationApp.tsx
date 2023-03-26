import { ChakraProvider } from '@chakra-ui/react';
import { combineReducers, Store } from '@reduxjs/toolkit';
import { i18n } from 'i18next';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route } from 'react-router-dom';
import SlideRoutes from 'react-slide-routes';

// Components
import Fonts from '../Fonts';
import RegistrationAppProvider from '../RegistrationAppProvider';

// Constants
import {
  CREATE_PASSWORD_ROUTE,
  GET_STARTED_ROUTE,
  ENTER_MNEMONIC_PHRASE_ROUTE,
  NAME_ACCOUNT_ROUTE,
  ACCOUNTS_ROUTE,
} from '../../constants';

// Features
import { reducer as applicationReducer } from '../../features/application';
import { reducer as registrationReducer } from '../../features/registration';

// Pages
import CreatePasswordPage from '../../pages/CreatePasswordPage';
import EnterMnemonicPhrasePage from '../../pages/EnterMnemonicPhrasePage';
import GetStartedPage from '../../pages/GetStartedPage';
import NameAccountPage from '../../pages/NameAccountPage';

// Theme
import { theme } from '../../theme';

// Types
import { IRegistrationRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

interface IProps {
  i18next: i18n;
}

const RegistrationApp: FC<IProps> = ({ i18next }: IProps) => {
  const store: Store<IRegistrationRootState> =
    makeStore<IRegistrationRootState>(
      combineReducers({
        application: applicationReducer,
        registration: registrationReducer,
      })
    );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ChakraProvider theme={theme}>
          <Fonts />
          <HashRouter>
            <RegistrationAppProvider>
              <SlideRoutes>
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
                  element={<EnterMnemonicPhrasePage />}
                  path={ENTER_MNEMONIC_PHRASE_ROUTE}
                />
                <Route
                  element={<NameAccountPage />}
                  path={NAME_ACCOUNT_ROUTE}
                />
              </SlideRoutes>
            </RegistrationAppProvider>
          </HashRouter>
        </ChakraProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default RegistrationApp;
