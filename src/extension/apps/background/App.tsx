import { combineReducers, Store } from '@reduxjs/toolkit';
import React, { FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as arc200AssetsReducer } from '@extension/features/arc0200-assets';
import { reducer as eventsReducer } from '@extension/features/events';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as passwordLockReducer } from '@extension/features/password-lock';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as standardAssetsReducer } from '@extension/features/standard-assets';
import { reducer as systemReducer } from '@extension/features/system';

// types
import { IAppProps, IBackgroundRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';

const App: FC<IAppProps> = ({ i18next, initialColorMode }: IAppProps) => {
  const store: Store<IBackgroundRootState> = makeStore<IBackgroundRootState>(
    combineReducers({
      accounts: accountsReducer,
      arc0200Assets: arc200AssetsReducer,
      events: eventsReducer,
      messages: messagesReducer,
      networks: networksReducer,
      passwordLock: passwordLockReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      standardAssets: standardAssetsReducer,
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
