// types
import type { ILogger } from '@common/types';
import type { INetworkConnectivity, ISystemInfo } from '@extension/types';

interface IState {
  info: ISystemInfo | null;
  logger: ILogger;
  networkConnectivity: INetworkConnectivity;
}

export default IState;
