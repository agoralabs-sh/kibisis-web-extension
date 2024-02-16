import { useState } from 'react';

// constants
import { QR_CODE_SCAN_INTERVAL } from '@extension/constants';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import { IUseCaptureQrCodeState } from './types';

// utils
import { captureQrCode } from './utils';

export default function useCaptureQrCode(): IUseCaptureQrCodeState {
  const _functionName: string = 'useCaptureQrCode';
  // selectors
  const logger: ILogger = useSelectLogger();
  // states
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [uri, setUri] = useState<string | null>(null);
  // misc
  const captureAction: () => Promise<void> = async () => {
    let capturedURI: string;

    try {
      capturedURI = await captureQrCode();

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
  const startScanningAction: () => void = () => {
    setScanning(true);

    (async () => {
      await captureAction();

      // add a three-second interval that attempts to capture a qr code on the screen
      setIntervalId(
        window.setInterval(async () => {
          if (uri) {
            return stopScanningAction();
          }

          // attempt to capture the qr code
          await captureAction();
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
