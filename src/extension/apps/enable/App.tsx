import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// Components
import Fonts from '../../components/Fonts';
import ThemeProvider from '../../components/ThemeProvider';

// Features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as applicationReducer } from '@extension/features/application';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';

// Pages
import EnablePage from '../../pages/EnablePage';

// Types
import { IAppProps, IMainRootState } from '@extension/types';

// Utils
import { makeStore } from '@extension/utils';

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      application: applicationReducer,
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
          <Fonts />
          <EnablePage />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
