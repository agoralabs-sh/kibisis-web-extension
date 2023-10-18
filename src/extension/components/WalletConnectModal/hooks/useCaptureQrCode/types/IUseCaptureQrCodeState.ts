interface IUseCaptureQrCodeState {
  captureAction: () => void;
  scanning: boolean;
  url: string | null;
}

export default IUseCaptureQrCodeState;
