import { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  network: INetwork;
  password: string;
  unsignedTransactions: Transaction[];
}

export default IOptions;
