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
import { reducer as credentialLockReducer } from '@extension/features/credential-lock';
import { reducer as eventsReducer } from '@extension/features/events';
import { reducer as layoutReducer } from '@extension/features/layout';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as passkeysReducer } from '@extension/features/passkeys';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as standardAssetsReducer } from '@extension/features/standard-assets';
import { reducer as systemReducer } from '@extension/features/system';

// types
import type { IAppProps, IBackgroundRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';

const App: FC<IAppProps> = ({ i18next, initialColorMode }) => {
  const store: Store<IBackgroundRootState> = makeStore<IBackgroundRootState>(
    combineReducers({
      accounts: accountsReducer,
      arc0200Assets: arc200AssetsReducer,
      credentialLock: credentialLockReducer,
      events: eventsReducer,
      layout: layoutReducer,
      messages: messagesReducer,
      networks: networksReducer,
      passkeys: passkeysReducer,
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
