// Utils
import { injectScript } from '../utils';

(() => {
  // inject the web resources to the web page to initialise the window.algorand object
  injectScript(browser.runtime.getURL('resources/agora-wallet.js'));
})();
