// utils
import createLogger from '@common/utils/createLogger';

// types
import type { ISystemState } from '../types';

export default function getInitialState(): ISystemState {
  return {
    confirm: null,
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    online: true,
    sidebar: false,
    scanQRCodeModal: false,
  };
}
