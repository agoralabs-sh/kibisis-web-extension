import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

// components
import ThemeProvider from '@extension/components/ThemeProvider';
import Root from './Root';

// features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as credentialLockReducer } from '@extension/features/credential-lock';
import { reducer as eventsReducer } from '@extension/features/events';
import { reducer as layoutReducer } from '@extension/features/layout';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as passkeysReducer } from '@extension/features/passkeys';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as systemReducer } from '@extension/features/system';

// types
import type { IAppProps, IHardwareWalletRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';

const App: FC<IAppProps> = ({ i18n, initialColorMode, initialFontFamily }) => {
  const store: Store<IHardwareWalletRootState> =
    makeStore<IHardwareWalletRootState>(
      combineReducers({
        accounts: accountsReducer,
        credentialLock: credentialLockReducer,
        events: eventsReducer,
        layout: layoutReducer,
        networks: networksReducer,
        passkeys: passkeysReducer,
        settings: settingsReducer,
        system: systemReducer,
      })
    );

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider
          initialColorMode={initialColorMode}
          initialFontFamily={initialFontFamily}
        >
          <Root i18n={i18n} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
