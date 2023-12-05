import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as assetsReducer } from '@extension/features/assets';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as sendAssetsReducer } from '@extension/features/send-assets';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as systemReducer } from '@extension/features/system';

// types
import { IAppProps, IMainRootState } from '@extension/types';

// utils
import { makeStore } from '@extension/utils';

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      assets: assetsReducer,
      messages: messagesReducer,
      networks: networksReducer,
      sendAssets: sendAssetsReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      system: systemReducer,
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
