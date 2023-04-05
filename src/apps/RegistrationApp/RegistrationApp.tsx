import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route } from 'react-router-dom';
import SlideRoutes from 'react-slide-routes';

// Components
import Fonts from '../../components/Fonts';
import RegistrationAppProvider from '../../components/RegistrationAppProvider';
import ThemeProvider from '../../components/ThemeProvider';

// Constants
import {
  CREATE_PASSWORD_ROUTE,
  GET_STARTED_ROUTE,
  ENTER_MNEMONIC_PHRASE_ROUTE,
  NAME_ACCOUNT_ROUTE,
} from '../../constants';

// Features
import { reducer as applicationReducer } from '../../features/application';
import { reducer as networksReducer } from '../../features/networks';
import { reducer as settingsReducer } from '../../features/settings';
import { reducer as registrationReducer } from '../../features/registration';

// Pages
import CreatePasswordPage from '../../pages/CreatePasswordPage';
import EnterMnemonicPhrasePage from '../../pages/EnterMnemonicPhrasePage';
import GetStartedPage from '../../pages/GetStartedPage';
import NameAccountPage from '../../pages/NameAccountPage';

// Types
import { IAppProps, IRegistrationRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

const RegistrationApp: FC<IAppProps> = ({
  i18next,
  initialColorMode,
}: IAppProps) => {
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
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default RegistrationApp;
