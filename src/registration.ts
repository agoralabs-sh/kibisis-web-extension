import I18next, { i18n } from 'i18next';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';

// Components
import RegistrationApp from './components/RegistrationApp';

// Translations
import { en } from './translations';

async function onLoad(): Promise<void> {
  const rootElement: HTMLElement | null = document.getElementById('root');
  let i18next: i18n;
  let root: Root;

  if (!rootElement) {
    return;
  }

  root = createRoot(rootElement);
  i18next = I18next.use(initReactI18next);

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

  root.render(createElement(RegistrationApp, { i18next }));
}

window.onload = onLoad;
