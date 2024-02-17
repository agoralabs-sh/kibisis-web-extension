// types
import IScanMode from './IScanMode';

interface IUseCaptureQrCodeState {
  resetAction: () => void;
  scanning: boolean;
  startScanningAction: (mode: IScanMode) => void;
  stopScanningAction: () => void;
  uri: string | null;
}

export default IUseCaptureQrCodeState;
