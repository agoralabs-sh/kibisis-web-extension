import { useState } from 'react';

// constants
import { QR_CODE_SCAN_INTERVAL } from '@extension/constants';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IScanMode, IUseCaptureQrCodeState } from './types';

// utils
import captureQRCode from './utils/captureQRCode';

export default function useCaptureQRCode(): IUseCaptureQrCodeState {
  const _functionName: string = 'useCaptureQRCode';
  // selectors
  const logger: ILogger = useSelectLogger();
  // states
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [_, setScanMode] = useState<IScanMode | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const captureAction = async (mode: IScanMode) => {
    let capturedURI: string;

    try {
      capturedURI = await captureQRCode(mode);

      setURI(capturedURI);

      return stopScanningAction();
    } catch (error) {
      logger.debug(`${_functionName}(): ${error.message}`);
    }
  };
  const resetAction = () => {
    setURI(null);
    setScanMode(null);
    stopScanningAction();
  };
  const startScanningAction = (mode: IScanMode) => {
    setScanMode(mode);
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
  const stopScanningAction = () => {
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
