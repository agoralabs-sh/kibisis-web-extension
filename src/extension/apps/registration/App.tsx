import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

// Components
import Fonts from '@extension/components/Fonts';
import RegistrationAppProvider from '@extension/components/RegistrationAppProvider';
import ThemeProvider from '@extension/components/ThemeProvider';

// Constants
import {
  CREATE_PASSWORD_ROUTE,
  GET_STARTED_ROUTE,
  ENTER_MNEMONIC_PHRASE_ROUTE,
  NAME_ACCOUNT_ROUTE,
} from '@extension/constants';

// Features
import { reducer as applicationReducer } from '@extension/features/application';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as registrationReducer } from '@extension/features/registration';

// Pages
import CreatePasswordPage from '@extension/pages/CreatePasswordPage';
import EnterMnemonicPhrasePage from '@extension/pages/EnterMnemonicPhrasePage';
import GetStartedPage from '@extension/pages/GetStartedPage';
import NameAccountPage from '@extension/pages/NameAccountPage';

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
            <RegistrationAppProvider>
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
                  element={<EnterMnemonicPhrasePage />}
                  path={ENTER_MNEMONIC_PHRASE_ROUTE}
                />
                <Route
                  element={<NameAccountPage />}
                  path={NAME_ACCOUNT_ROUTE}
                />
              </Routes>
            </RegistrationAppProvider>
          </HashRouter>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
