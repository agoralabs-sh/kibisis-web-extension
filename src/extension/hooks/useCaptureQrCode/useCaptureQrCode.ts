import { useState } from 'react';

// constants
import { QR_CODE_SCAN_INTERVAL } from '@extension/constants';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IScanMode, IUseCaptureQrCodeState } from './types';

// utils
import captureQrCode from './utils/captureQrCode';

export default function useCaptureQrCode(): IUseCaptureQrCodeState {
  const _functionName: string = 'useCaptureQrCode';
  // selectors
  const logger: ILogger = useSelectLogger();
  // states
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [mode, setScanMode] = useState<IScanMode | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [uri, setUri] = useState<string | null>(null);
  // misc
  const captureAction: (mode: IScanMode) => Promise<void> = async (
    mode: IScanMode
  ) => {
    let capturedURI: string;

    try {
      capturedURI = await captureQrCode(mode);

      setUri(capturedURI);

      return stopScanningAction();
    } catch (error) {
      logger.debug(`${_functionName}(): ${error.message}`);
    }
  };
  const resetAction = () => {
    setUri(null);
    stopScanningAction();
  };
  const startScanningAction: (mode: IScanMode) => void = (mode: IScanMode) => {
    setScanning(true);

    (async () => {
      await captureAction(mode);

      // add a three-second interval that attempts to capture a qr code on the screen
      setIntervalId(
        window.setInterval(async () => {
          if (uri) {
            return stopScanningAction();
          }

          // attempt to capture the qr code
          await captureAction(mode);
        }, QR_CODE_SCAN_INTERVAL)
      );
    })();
  };
  const stopScanningAction: () => void = () => {
    if (intervalId) {
      window.clearInterval(intervalId);

      setIntervalId(null);
    }

    setScanning(false);
  };

  return {
    resetAction,
    scanning,
    startScanningAction,
    stopScanningAction,
    uri,
  };
}
