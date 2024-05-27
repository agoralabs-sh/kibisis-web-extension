// enums
import { AppTypeEnum } from '@extension/enums';

interface IAppWindow {
  left: number;
  top: number;
  type: AppTypeEnum;
  windowId: number;
}

export default IAppWindow;
