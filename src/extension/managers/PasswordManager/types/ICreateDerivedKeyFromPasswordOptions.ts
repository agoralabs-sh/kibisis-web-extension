// types
import { IBaseOptions } from '@common/types';

interface ICreateDerivedKeyFromPasswordOptions extends IBaseOptions {
  password: string;
  salt: Uint8Array;
}

export default ICreateDerivedKeyFromPasswordOptions;
