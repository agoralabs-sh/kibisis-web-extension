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
  // selectors
  const logger: ILogger = useSelectLogger();
  // states
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  // misc
  const captureAction: () => Promise<void> = async () => {
    let capturedUrl: string;

    try {
      capturedUrl = await captureQrCode();

      setUrl(capturedUrl);

      return stopScanningAction();
    } catch (error) {
      logger.debug(error.message);
    }
  };
  const startScanningAction: () => void = () => {
    setScanning(true);

    (async () => {
      await captureAction();

      // add a three-second interval that attempts to capture a qr code on the screen
      setIntervalId(
        window.setInterval(async () => {
          if (url) {
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
    scanning,
    startScanningAction,
    stopScanningAction,
    url,
  };
}
