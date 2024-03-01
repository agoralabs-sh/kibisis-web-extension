import { useState } from 'react';

// constants
import { QR_CODE_SCAN_INTERVAL } from '@extension/constants';

// enums
import { ScanModeEnum } from '@extension/enums';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IStartScanningOptions, IUseCaptureQrCodeState } from './types';

// utils
import captureQRCodeFromCamera from './utils/captureQRCodeFromCamera';
import captureQRCodeFromTab from './utils/captureQRCodeFromTab';

export default function useCaptureQRCode(): IUseCaptureQrCodeState {
  // selectors
  const logger: ILogger = useSelectLogger();
  // states
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [uri, setURI] = useState<string | null>(null);
  // misc
  const captureAction = async (options: IStartScanningOptions) => {
    const _functionName: string = 'captureAction';
    let capturedURI: string | null = null;

    try {
      switch (options.mode) {
        case ScanModeEnum.Camera:
          capturedURI = await captureQRCodeFromCamera(options.videoElement);
          break;
        case ScanModeEnum.Tab:
          capturedURI = await captureQRCodeFromTab();
          break;
        default:
          break;
      }

      setURI(capturedURI);

      return stopScanningAction();
    } catch (error) {
      logger.debug(`${_functionName}: ${error.message}`);
    }
  };
  const resetAction = () => {
    setURI(null);
    stopScanningAction();
  };
  const startScanningAction = (options: IStartScanningOptions) => {
    setScanning(true);

    (async () => {
      await captureAction(options);

      // add a three-second interval that attempts to capture a qr code on the screen
      setIntervalId(
        window.setInterval(async () => {
          if (uri) {
            return stopScanningAction();
          }

          // attempt to capture the qr code
          await captureAction(options);
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
