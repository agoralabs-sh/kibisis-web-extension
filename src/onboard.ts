import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Components
import OnboardApp from './components/OnboardApp';

(() => {
  const rootElement: HTMLElement | null = document.getElementById('root');
  let root: Root;

  if (!rootElement) {
    return;
  }

  root = createRoot(rootElement);

  root.render(createElement(OnboardApp));
})();
