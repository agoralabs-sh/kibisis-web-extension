// types
import { IBaseOptions } from '@common/types';

interface IGenerateEncryptionKeyFromPasswordOptions extends IBaseOptions {
  password: string;
  salt: Uint8Array;
}

export default IGenerateEncryptionKeyFromPasswordOptions;
