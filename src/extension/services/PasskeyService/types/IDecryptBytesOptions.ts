// types
import type { IBaseOptions } from '@common/types';

interface IDecryptBytesOptions extends IBaseOptions {
  deviceID: string;
  encryptedBytes: Uint8Array;
  initializationVector: Uint8Array;
  inputKeyMaterial: Uint8Array;
}

export default IDecryptBytesOptions;
