interface IUseCaptureQrCodeState {
  scanning: boolean;
  startScanningAction: () => void;
  stopScanningAction: () => void;
  uri: string | null;
}

export default IUseCaptureQrCodeState;
