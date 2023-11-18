// plugins
import { ITargetType } from '../plugins/WebExtPlugin';

interface IWebpackEnvironmentVariables {
  WEB_EXT_TARGET?: ITargetType;
  WEBPACK_SERVE?: boolean;
  WEBPACK_WATCH?: boolean;
}

export default IWebpackEnvironmentVariables;
