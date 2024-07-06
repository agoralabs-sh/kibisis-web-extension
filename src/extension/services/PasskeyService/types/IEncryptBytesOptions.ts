// types
import type { IBaseOptions } from '@common/types';

interface IEncryptBytesOptions extends IBaseOptions {
  bytes: Uint8Array;
  deviceID: string;
  initializationVector: Uint8Array;
  inputKeyMaterial: Uint8Array;
}

export default IEncryptBytesOptions;
