import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// providers
import ThemeProvider from '@extension/components/ThemeProvider';

// features
import { reducer as accountsReducer } from '@extension/features/accounts';
import { reducer as addAssetsReducer } from '@extension/features/add-assets';
import { reducer as arc0072AssetsReducer } from '@extension/features/arc0072-assets';
import { reducer as arc200AssetsReducer } from '@extension/features/arc0200-assets';
import { reducer as credentialLockReducer } from '@extension/features/credential-lock';
import { reducer as eventsReducer } from '@extension/features/events';
import { reducer as layoutReducer } from '@extension/features/layout';
import { reducer as messagesReducer } from '@extension/features/messages';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as notificationsReducer } from '@extension/features/notifications';
import { reducer as passkeysReducer } from '@extension/features/passkeys';
import { reducer as reKeyAccountReducer } from '@extension/features/re-key-account';
import { reducer as removeAssetsReducer } from '@extension/features/remove-assets';
import { reducer as sendAssetsReducer } from '@extension/features/send-assets';
import { reducer as sessionsReducer } from '@extension/features/sessions';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as standardAssetsReducer } from '@extension/features/standard-assets';
import { reducer as systemReducer } from '@extension/features/system';

// pages
import SplashPage from '@extension/pages/SplashPage';

// types
import type { IAppProps, IMainRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';
import createRouter from './utils/createRouter';

const App: FC<IAppProps> = ({
  i18n,
  initialColorMode,
  initialFontFamily,
}: IAppProps) => {
  const store: Store<IMainRootState> = makeStore<IMainRootState>(
    combineReducers({
      accounts: accountsReducer,
      addAssets: addAssetsReducer,
      arc0072Assets: arc0072AssetsReducer,
      arc0200Assets: arc200AssetsReducer,
      credentialLock: credentialLockReducer,
      events: eventsReducer,
      layout: layoutReducer,
      messages: messagesReducer,
      networks: networksReducer,
      notifications: notificationsReducer,
      passkeys: passkeysReducer,
      reKeyAccount: reKeyAccountReducer,
      removeAssets: removeAssetsReducer,
      sendAssets: sendAssetsReducer,
      sessions: sessionsReducer,
      settings: settingsReducer,
      standardAssets: standardAssetsReducer,
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
          <RouterProvider
            fallbackElement={<SplashPage />}
            router={createRouter({
              i18n,
              store,
            })}
          />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
