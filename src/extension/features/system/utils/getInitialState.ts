// utils
import createLogger from '@common/utils/createLogger';

// types
import type { ISystemState } from '../types';

export default function getInitialState(): ISystemState {
  return {
    confirmModal: null,
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    online: true,
    scanQRCodeModal: null,
    sidebar: false,
  };
}
