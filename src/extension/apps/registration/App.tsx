import { combineReducers, type Store } from '@reduxjs/toolkit';
import React, { type FC } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

// features
import { reducer as arc200AssetsReducer } from '@extension/features/arc0200-assets';
import { reducer as layoutReducer } from '@extension/features/layout';
import { reducer as networksReducer } from '@extension/features/networks';
import { reducer as notificationsReducer } from '@extension/features/notifications';
import { reducer as settingsReducer } from '@extension/features/settings';
import { reducer as registrationReducer } from '@extension/features/registration';
import { reducer as systemReducer } from '@extension/features/system';

// providers
import ThemeProvider from '@extension/components/ThemeProvider';

// types
import type { IAppProps, IRegistrationRootState } from '@extension/types';

// utils
import makeStore from '@extension/utils/makeStore';
import createRouter from './utils/createRouter';

const App: FC<IAppProps> = ({
  i18n,
  initialColorMode,
  initialFontFamily,
}: IAppProps) => {
  const store: Store<IRegistrationRootState> =
    makeStore<IRegistrationRootState>(
      combineReducers({
        arc0200Assets: arc200AssetsReducer,
        layout: layoutReducer,
        networks: networksReducer,
        notifications: notificationsReducer,
        settings: settingsReducer,
        registration: registrationReducer,
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
          <RouterProvider router={createRouter({ i18n })} />
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
