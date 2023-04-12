// Utils
import { createLogger } from '@common/utils';

// Types
import { IApplicationState } from '../types';

export default function getInitialState(): IApplicationState {
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
