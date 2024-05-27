// types
import type { ILogger } from '@common/types';
import type { ISystemInfo } from '@extension/types';

interface IState {
  info: ISystemInfo | null;
  logger: ILogger;
  online: boolean;
}

export default IState;
