// utils
import createLogger from '@common/utils/createLogger';

// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    online: true,
  };
}
