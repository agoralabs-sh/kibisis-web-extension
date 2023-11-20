// types
import { ITargetType } from '../../../types';

/**
 * @property {boolean} browserConsole - [optional] opens the browser console. Defaults to `false`.
 * @property {boolean} devtools - [optional] opens the dev tools. Defaults to `false`.
 * @property {boolean} persistState - [optional] whether the extension state is persisted when the browser is closed.
 * Defaults to `false`.
 * @see {@link https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/#using-web-ext-section}
 * @property {string[]} startUrls - [optional] opens tabs to the at the specified URLs. Defaults to
 * [`http://info.cern.ch/hypertext/WWW/TheProject.html`].
 * @property {'chrome' | 'firefox'} target - [optional] target a specific browser. Defaults to 'firefox'.
 */
interface IOptions {
  browserConsole?: boolean;
  devtools?: boolean;
  persistState?: boolean;
  startUrls?: string[];
  target?: ITargetType;
}

export default IOptions;
