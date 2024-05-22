import type { Transaction } from 'algosdk';

// types
import type { IBaseOptions } from '@common/types';
import type { IAccountWithExtendedProps, INetwork } from '@extension/types';

interface IOptions extends IBaseOptions {
  accounts: IAccountWithExtendedProps[];
  network: INetwork;
  password: string;
  unsignedTransaction: Transaction;
}

export default IOptions;
