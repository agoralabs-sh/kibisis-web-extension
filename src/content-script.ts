import browser from 'webextension-polyfill';

// Utils
import { injectScript } from './utils';

(() => {
  // inject the web resources to the web page to initialise the window.algorand object
  injectScript(browser.runtime.getURL('agora-wallet.js'));
})();
