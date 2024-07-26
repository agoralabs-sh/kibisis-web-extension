// types
import type { IBaseOptions } from '@common/types';

interface IOptions extends IBaseOptions {
  privateKey: Uint8Array;
}

export default IOptions;
