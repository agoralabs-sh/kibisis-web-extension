import '@extension/styles/fonts.css';
import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

// components
import App from './components/App/App';

async function onLoad(): Promise<void> {
  const rootElement: HTMLElement | null = document.getElementById('root');
  let root: Root;

  if (!rootElement) {
    return;
  }

  root = createRoot(rootElement);

  root.render(createElement(App));
}

window.onload = onLoad;
