import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Components
import PopupApp from './components/PopupApp';

(() => {
  const rootElement: HTMLElement | null = document.getElementById('root');
  let root: Root;

  if (!rootElement) {
    return;
  }

  root = createRoot(rootElement);

  root.render(createElement(PopupApp));
})();
