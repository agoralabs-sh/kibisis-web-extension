// types
import { IBaseOptions } from '@common/types';

interface IDecryptAndEncryptBytesOptions extends IBaseOptions {
  data: Uint8Array;
  password: string;
}

export default IDecryptAndEncryptBytesOptions;
