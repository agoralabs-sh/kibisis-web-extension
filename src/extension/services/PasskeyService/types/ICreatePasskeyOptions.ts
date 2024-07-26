// types
import type { IBaseOptions } from '@common/types';

interface ICreatePasskeyOptions extends IBaseOptions {
  deviceID: string;
  name?: string;
}

export default ICreatePasskeyOptions;
