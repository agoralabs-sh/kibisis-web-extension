// enums
import { EnvironmentEnum, TargetEnum } from '../enums';

interface IWebpackEnvironmentVariables {
  WEBPACK_SERVE?: boolean;
  WEBPACK_WATCH?: boolean;
  environment?: EnvironmentEnum;
  target?: TargetEnum;
}

export default IWebpackEnvironmentVariables;
