// types
import ITargetType from './ITargetType';

interface IWebpackEnvironmentVariables {
  WEBPACK_SERVE?: boolean;
  WEBPACK_WATCH?: boolean;
  target?: ITargetType;
}

export default IWebpackEnvironmentVariables;
