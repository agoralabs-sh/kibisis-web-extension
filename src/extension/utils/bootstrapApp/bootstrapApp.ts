import I18next, { type i18n } from 'i18next';
import { createElement, type FC } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

// repositories
import SettingsRepository from '@extension/repositories/SettingsRepository';

// translations
import { en } from '@extension/translations';

// types
import type { IAppProps, ISettings } from '@extension/types';

export default function bootstrapApp(app: FC<IAppProps>): () => Promise<void> {
  return async (): Promise<void> => {
    const rootElement = document.getElementById('root');
    let settings: ISettings | null;
    let i18next: i18n;
    let root: Root;

    if (!rootElement) {
      return;
    }

    settings = await new SettingsRepository().fetch();
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
        initialColorMode: settings?.appearance.theme || 'light', // default to light
        initialFontFamily: settings?.appearance.font || 'Nunito',
      })
    );
  };
}
