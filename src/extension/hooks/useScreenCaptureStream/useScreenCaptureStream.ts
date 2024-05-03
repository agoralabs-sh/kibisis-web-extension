import { useState } from 'react';

// errors
import {
  BaseExtensionError,
  ScreenCaptureError,
  ScreenCaptureNotAllowedError,
  ScreenCaptureNotFoundError,
} from '@extension/errors';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { IUseScreenCaptureState } from './types';

// utils
import isScreenCaptureAvailable from '@extension/utils/isScreenCaptureAvailable';

export default function useScreenCaptureStream(): IUseScreenCaptureState {
  // selectors
  const logger = useSelectLogger();
  // state
  const [error, setError] = useState<BaseExtensionError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  // handlers
  const reset = () => {
    stopStream();
    setError(null);
    setLoading(false);
    setStream(null);
  };
  const startStream = async () => {
    const _functionName: string = 'startStream';
    let _stream: MediaStream;

    if (!isScreenCaptureAvailable()) {
      setError(new ScreenCaptureNotFoundError('screen capture unavailable'));

      return;
    }

    try {
      setError(null);
      setLoading(true);

      _stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        monitorTypeSurfaces: 'exclude',
        selfBrowserSurface: 'exclude',
        systemAudio: 'exclude',
        surfaceSwitching: 'exclude',
        video: {
          displaySurface: 'window',
        },
      } as any);

      // set the stream
      setStream(_stream);
    } catch (error) {
      logger.error(`${_functionName}: `, error);

      // if the user denied access, inform the user
      if ((error as DOMException).name === 'NotAllowedError') {
        setError(
          new ScreenCaptureNotAllowedError(
            'screen capture was denied permission'
          )
        );
        setLoading(false);

        return;
      }

      setError(
        new ScreenCaptureError((error as DOMException).name, error.message)
      );
    }
  };
  const stopStream = () => {
    // stop the camera stream
    if (stream) {
      stream.getTracks().forEach((value) => value.stop());
    }
  };

  return {
    error,
    loading,
    reset,
    startStream,
    stopStream,
    stream,
  };
}
