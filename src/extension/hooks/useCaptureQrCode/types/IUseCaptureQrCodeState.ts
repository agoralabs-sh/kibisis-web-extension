interface IUseCaptureQrCodeState {
  scanning: boolean;
  startScanningAction: () => void;
  stopScanningAction: () => void;
  url: string | null;
}

export default IUseCaptureQrCodeState;
