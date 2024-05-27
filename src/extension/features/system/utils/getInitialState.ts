// utils
import createLogger from '@common/utils/createLogger';

// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    deviceID: null,
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    online: true,
  };
}
