import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

// App
import App from './App';

(() => {
  const rootElement: HTMLElement | null = document.getElementById('root');
  let root: Root;

  if (!rootElement) {
    return;
  }

  root = createRoot(rootElement);

  root.render(createElement(App));
})();
