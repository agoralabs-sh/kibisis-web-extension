/**
 * @property {boolean} browserConsole - [optional] opens the browser console. Defaults to `false`.
 * @property {boolean} devtools - [optional] opens the dev tools. Defaults to `false`.
 * @property {string[]} startUrls - [optional] opens tabs to the at the specified URLs. Defaults to
 * [`http://info.cern.ch/hypertext/WWW/TheProject.html`].
 */
interface IOptions {
  browserConsole?: boolean;
  devtools?: boolean;
  startUrls?: string[];
}

export default IOptions;
