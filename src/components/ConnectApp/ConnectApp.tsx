import { ChakraProvider } from '@chakra-ui/react';
import { combineReducers, Store } from '@reduxjs/toolkit';
import { i18n } from 'i18next';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// Components
import Fonts from '../Fonts';

// Features
import { reducer as accountsReducer } from '../../features/accounts';
import { reducer as applicationReducer } from '../../features/application';
import { reducer as networksReducer } from '../../features/networks';
import { reducer as sessionsReducer } from '../../features/sessions';
import { reducer as settingsReducer } from '../../features/settings';

// Pages
import ConnectPage from '../../pages/ConnectPage';

// Theme
import { theme } from '../../theme';

// Types
import { IMainRootState } from '../../types';

// Utils
import { makeStore } from '../../utils';

interface IProps {
  i18next: i18n;
}

const ConnectApp: FC<IProps> = ({ i18next }: IProps) => {
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
        <ChakraProvider theme={theme}>
          <Fonts />
          <ConnectPage />
        </ChakraProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default ConnectApp;
