import I18next, { i18n } from 'i18next';
import { createElement, type FC } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

// constants
import { SETTINGS_APPEARANCE_KEY } from '@extension/constants';

// services
import StorageManager from '@extension/services/StorageManager';

// translations
import { en } from '@extension/translations';

// types
import type { IAppearanceSettings, IAppProps } from '@extension/types';

export default function bootstrapApp(app: FC<IAppProps>): () => Promise<void> {
  return async (): Promise<void> => {
    const rootElement = document.getElementById('root');
    const storageManager = new StorageManager();
    let appearanceSettings: IAppearanceSettings | null;
    let i18next: i18n;
    let root: Root;

    if (!rootElement) {
      return;
    }

    appearanceSettings = await storageManager.getItem<IAppearanceSettings>(
      SETTINGS_APPEARANCE_KEY
    );
    i18next = I18next.use(initReactI18next);
    root = createRoot(rootElement);

    await i18next.init({
      compatibilityJSON: 'v3',
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        en: {
          translation: en,
        },
      },
    });

    root.render(
      createElement(app, {
        i18n: i18next,
        initialColorMode: appearanceSettings?.theme || 'light', // default to light
        initialFontFamily: appearanceSettings?.font || 'Nunito',
      })
    );
  };
}
