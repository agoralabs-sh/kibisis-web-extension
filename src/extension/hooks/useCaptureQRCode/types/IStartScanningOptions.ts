// enums
import { ScanModeEnum } from '@extension/enums';

type IStartScanningOptions =
  | {
      mode: ScanModeEnum.Camera;
      videoElement: HTMLVideoElement;
    }
  | {
      mode: ScanModeEnum.Tab;
    };

export default IStartScanningOptions;
