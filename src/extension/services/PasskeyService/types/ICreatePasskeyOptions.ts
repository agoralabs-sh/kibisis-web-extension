// types
import type { ILogger } from '@common/types';

interface ICreatePasskeyOptions {
  deviceID: string;
  logger?: ILogger;
}

export default ICreatePasskeyOptions;
