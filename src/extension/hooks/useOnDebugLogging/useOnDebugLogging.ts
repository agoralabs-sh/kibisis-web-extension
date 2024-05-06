import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// features
import { setLogger } from '@extension/features/system';

// selectors
import { useSelectSettingsDebugLogging } from '@extension/selectors';

// types
import { ILogger } from '@common/types';
import { IAppThunkDispatch } from '@extension/types';

// utils
import createLogger from '@common/utils/createLogger';

export default function useOnDebugLogging(): void {
  const dispatch: IAppThunkDispatch = useDispatch<IAppThunkDispatch>();
  // hooks
  const debugLogging: boolean = useSelectSettingsDebugLogging();

  // if the debug logging is turned on, force debug logging by updating the system wide logger
  useEffect(() => {
    let logger: ILogger = createLogger(
      __ENV__ === 'development' ? 'debug' : 'error'
    ); // if we are in a dev environment, logging is always on

    if (debugLogging) {
      logger = createLogger('debug');
    }

    dispatch(setLogger(logger));
  }, [debugLogging]);
}
