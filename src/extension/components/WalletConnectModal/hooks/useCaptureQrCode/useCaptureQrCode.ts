import { useState } from 'react';

// Selectors
import { useSelectLogger } from '@extension/selectors';

// Types
import { ILogger } from '@common/types';
import { IUseCaptureQrCodeState } from './types';

// Utils
import { captureQrCode } from './utils';

export default function useCaptureQrCode(): IUseCaptureQrCodeState {
  const logger: ILogger = useSelectLogger();
  const [scanning, setScanning] = useState<boolean>(false);
  const [url, setUrl] = useState<string | null>(null);
  const captureAction: () => void = () => {
    let capturedUrl: string;
    let intervalId: number;

    setScanning(true);

    (async () => {
      try {
        capturedUrl = await captureQrCode();

        setUrl(capturedUrl);
        setScanning(false);

        return;
      } catch (error) {
        logger.debug(error.message);
      }

      // add a one second interval that attempts to capture a qr code on the screen
      intervalId = window.setInterval(async () => {
        if (capturedUrl) {
          window.clearInterval(intervalId);

          return;
        }

        try {
          capturedUrl = await captureQrCode();

          setUrl(capturedUrl);
          setScanning(false);
        } catch (error) {
          logger.debug(error.message);
        }
      }, 3000);
    })();
  };

  return {
    captureAction,
    scanning,
    url,
  };
}
