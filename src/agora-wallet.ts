import { Algorand } from './algorand-provider';

// Types
import { IWindow } from './types';

(() => {
  if (!(window as IWindow).algorand) {
    (window as IWindow).algorand = new Algorand();
  }
})();
