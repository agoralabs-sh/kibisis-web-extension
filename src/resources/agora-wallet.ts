// Types
import { IWindow } from '../types';

(() => {
  if (!(window as IWindow).algorand) {
    (window as IWindow).algorand = 'hello algorand';
  }
})();
