import { useState } from 'react';

// errors
import {
  BaseExtensionError,
  CameraError,
  CameraNotAllowedError,
  CameraNotFoundError,
} from '@extension/errors';

// selectors
import { useSelectLogger } from '@extension/selectors';

// types
import type { ILogger } from '@common/types';
import type { IUseCameraStreamState } from './types';

export default function useCameraStream(): IUseCameraStreamState {
  // selectors
  const logger: ILogger = useSelectLogger();
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

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(new CameraNotFoundError('camera not found'));

      return;
    }

    try {
      setError(null);
      setLoading(true);

      _stream = await navigator.mediaDevices.getUserMedia({
        video: {
          height: window.innerHeight,
          width: window.innerWidth,
        },
      });

      // set the stream
      setStream(_stream);
    } catch (error) {
      logger.error(`${_functionName}: `, error);

      // if the user denied access, inform the user
      if (
        (error as DOMException).name === 'NotAllowedError' ||
        (error as DOMException).name === 'SecurityError'
      ) {
        setError(new CameraNotAllowedError('camera was denied permission'));
        setLoading(false);

        return;
      }

      setError(new CameraError((error as DOMException).name, error.message));
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
