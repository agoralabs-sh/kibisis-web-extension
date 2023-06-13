import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// Components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// Features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as assetsReducer } from '@extension/features/assets';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as systemReducer } from '@extension/features/system';
import { reducer as transactionsReducer } from '@extension/features/transactions';

// Types
import { IAppProps, IMainRootState } from '@extension/types';

// Utils
import { makeStore } from '@extension/utils';

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      assets: assetsReducer,
      messages: messagesReducer,
      networks: networksReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      system: systemReducer,
      transactions: transactionsReducer,
    })
  );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider initialColorMode={initialColorMode}>
          <Root />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
