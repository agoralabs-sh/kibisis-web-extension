// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
  signedTransactions: Uint8Array[];
}

export default IOptions;
