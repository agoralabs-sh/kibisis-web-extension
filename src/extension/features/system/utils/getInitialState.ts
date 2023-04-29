// Utils
import { createLogger } from '@common/utils';

// Types
import { ISystemState } from '../types';

export default function getInitialState(): ISystemState {
  return {
    confirm: null,
    error: null,
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    navigate: null,
    online: true,
    sidebar: false,
    toast: null,
  };
}
