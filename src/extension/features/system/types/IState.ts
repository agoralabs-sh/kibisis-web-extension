import type { i18n } from 'i18next';

// types
import type { ILogger } from '@common/types';
import type { INetworkConnectivity, ISystemInfo } from '@extension/types';

interface IState {
  i18n: i18n | null;
  info: ISystemInfo | null;
  logger: ILogger;
  networkConnectivity: INetworkConnectivity;
}

export default IState;
