import I18next, { i18n } from 'i18next';
import { createElement, FC } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

// Constants
import { SETTINGS_APPEARANCE_KEY } from './constants';

// Services
import { StorageManager } from './services/extension';

// Translations
import { en } from './translations';

// Types
import { IAppearanceSettings, IAppProps } from './types';

export default function bootstrapApp(app: FC<IAppProps>): () => Promise<void> {
  return async (): Promise<void> => {
    const rootElement: HTMLElement | null = document.getElementById('root');
    const storageManager: StorageManager = new StorageManager();
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
        i18next,
        initialColorMode: appearanceSettings?.theme || 'light', // default to light
      })
    );
  };
}
