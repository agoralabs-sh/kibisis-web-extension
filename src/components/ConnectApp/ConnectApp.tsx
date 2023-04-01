import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// Components
import Fonts from '../Fonts';
import ThemeProvider from '../ThemeProvider';

// Features
import { reducer as accountsReducer } from '../../features/accounts';
import { reducer as applicationReducer } from '../../features/application';
import { reducer as networksReducer } from '../../features/networks';
import { reducer as sessionsReducer } from '../../features/sessions';
import { reducer as settingsReducer } from '../../features/settings';

// Pages
import ConnectPage from '../../pages/ConnectPage';

// Types
import { IAppProps, IMainRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

const ConnectApp: FC<IAppProps> = ({
  i18next,
  initialColorMode,
}: IAppProps) => {
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
          <ConnectPage />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default ConnectApp;
