// types
import IStartScanningOptions from './IStartScanningOptions';

interface IUseCaptureQrCodeState {
  resetAction: () => void;
  scanning: boolean;
  startScanningAction: (options: IStartScanningOptions) => void;
  stopScanningAction: () => void;
  uri: string | null;
}

export default IUseCaptureQrCodeState;
