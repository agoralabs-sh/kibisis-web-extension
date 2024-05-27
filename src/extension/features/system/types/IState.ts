// types
import type { ILogger } from '@common/types';

interface IState {
  deviceID: string | null;
  logger: ILogger;
  online: boolean;
}

export default IState;
