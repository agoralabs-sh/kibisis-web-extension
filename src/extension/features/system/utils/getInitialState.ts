// utils
import createLogger from '@common/utils/createLogger';

// types
import type { IState } from '../types';

export default function getInitialState(): IState {
  return {
    i18n: null,
    info: null,
    logger: createLogger(__ENV__ === 'development' ? 'debug' : 'error'),
    networkConnectivity: {
      checking: false,
      online: true,
      pollingID: null,
    },
  };
}
